import UserModel from '../models/user.model.js';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';
import VariantModel from '../models/variant.model.js';
import AddressModel from '../models/address.model.js';
import Errors from '../common/response/error.response.js';
// Constants
const MAX_QUANTITY_PER_ITEM = 10;

// Lấy giỏ hàng của user
export const getUserCart = async (buyerId) => {
	let cart = await CartModel.findOne({ buyerId })
		.populate({
			path: 'items.productId',
			select: 'slug userId title thumbnail condition attributes price _destroy verifyStatus activeStatus',
		})
		.populate({
			path: 'items.variantId',
			select: 'title price stock status attributes images',
		});

	if (!cart) {
		cart = await CartModel.create({ buyerId });
	}

	// Lọc bỏ sản phẩm không hợp lệ trước khi nhóm
	const validItems = cart.items.filter((item) => {
		const product = item.productId;
		const variant = item.variantId;

		if (
			!product ||
			product._destroy ||
			product.verifyStatus !== 'APPROVED'
		) {
			return false;
		}
		if (item.variantId && (!variant || variant.status !== 'ACTIVE')) {
			return false;
		}
		return true;
	});

	// Nhóm sản phẩm theo người bán
	let groupCart = {};
	for (const item of validItems) {
		const sellerId = item.productId.userId.toString();
		if (!groupCart[sellerId]) {
			groupCart[sellerId] = {
				sellerId,
				products: [],
			};
		}
		groupCart[sellerId].products.push({
			id: item.productId._id,
			variantId: item.variantId?._id || null,
			slug: item.productId.slug,
			title: item.productId.title,
			thumbnail: item.variantId
				? item.variantId.images[0].url
				: item.productId.thumbnail.url,
			condition: item.productId.condition,
			attributes: item.variantId
				? item.variantId.attributes
				: item.productId.attributes,
			price: item.price,
			quantity: item.quantity,
			amount: item.price * item.quantity,
			_destroy: item._destroy,
		});
	}

	// Lấy thông tin người bán cho từng nhóm
	const newCart = await Promise.all(
		Object.values(groupCart).map(async (group) => {
			const seller = await UserModel.findById(group.sellerId);
			let address = '';
			if (seller && seller.address) {
				const addressObj = await AddressModel.findById(seller.address);
				address = addressObj ? addressObj.provinceName : '';
			}
			return {
				...group,
				fullName: seller ? seller.fullName : '',
				address,
				avatar: seller ? seller.avatar.url : '',
			};
		}),
	);

	// Xử lý appliedCoupon - chỉ giữ lại khi có giá trị hợp lệ
	if (
		cart.appliedCoupon &&
		(!cart.appliedCoupon.code || cart.appliedCoupon.discountAmount === 0)
	) {
		cart.appliedCoupon = null;
	}

	cart.recalculateTotals();
	await cart.save();

	// Trả về dữ liệu đã nhóm và các thông tin tổng
	return {
		_id: cart._id,
		buyerId: cart.buyerId,
		itemsBySeller: newCart,
		totalPrice: cart.totalPrice,
		totalQuantity: cart.totalQuantity,
		appliedCoupon: cart.appliedCoupon,
	};
};

// Kiểm tra sản phẩm và variant
const checkProductAndVariant = async (productId, variantId, quantity) => {
	// Kiểm tra số lượng
	if (!quantity || quantity <= 0) {
		throw new Errors.BadRequestError('Số lượng phải lớn hơn 0');
	}

	if (quantity > MAX_QUANTITY_PER_ITEM) {
		throw new Errors.BadRequestError(
			`Số lượng tối đa là ${MAX_QUANTITY_PER_ITEM}`,
		);
	}

	// Kiểm tra sản phẩm
	const product = await ProductModel.findById(productId);
	if (!product || product._destroy || product.verifyStatus !== 'APPROVED') {
		throw new Errors.BadRequestError('Sản phẩm không khả dụng');
	}

	// Kiểm tra variant nếu có
	let variant = null;
	if (variantId) {
		variant = await VariantModel.findById(variantId);
		if (!variant || variant.status !== 'ACTIVE') {
			throw new Errors.BadRequestError(
				'Biến thể sản phẩm không khả dụng',
			);
		}

		if (variant.productId.toString() !== productId) {
			throw new Errors.BadRequestError(
				'Biến thể không thuộc sản phẩm này',
			);
		}

		// if (variant.stock < quantity) {
		// 	throw new Errors.BadRequestError(
		// 		`Chỉ còn ${variant.stock} sản phẩm trong kho`,
		// 	);
		// }
	}

	return { product, variant };
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (
	buyerId,
	productId,
	variantId = null,
	quantity = 1,
) => {
	// Kiểm tra sản phẩm và variant
	const { product, variant } = await checkProductAndVariant(
		productId,
		variantId,
		quantity,
	);

	// Lấy giỏ hàng
	let cart = await CartModel.findOne({ buyerId });

	// Tìm item đã tồn tại
	const existingItem = cart.findItem(productId, variantId);

	if (existingItem) {
		if (existingItem && existingItem._destroy) {
			existingItem._destroy = false;
			existingItem.quantity = quantity;
			existingItem.price = variant ? variant.price : product.price;
		}

		// Cập nhật số lượng nếu đã tồn tại
		const newQuantity = existingItem.quantity + quantity;

		if (newQuantity > MAX_QUANTITY_PER_ITEM) {
			throw new Errors.BadRequestError(
				`Tổng số lượng không được vượt quá ${MAX_QUANTITY_PER_ITEM}`,
			);
		}

		// Kiểm tra lại stock cho variant
		if (variant && variant.stock < newQuantity) {
			throw new Errors.BadRequestError(
				`Chỉ còn ${variant.stock} sản phẩm trong kho`,
			);
		}

		existingItem.quantity = newQuantity;
	} else {
		// Thêm item mới
		cart.items.push({
			productId,
			variantId,
			quantity,
			price: variant ? variant.price : product.price,
		});
	}

	cart.recalculateTotals();
	await cart.save();

	return cart;
};

// Cập nhật số lượng sản phẩm
export const updateCartItemQuantity = async (
	buyerId,
	productId,
	variantId = null,
	quantity,
) => {
	if (quantity < 0) {
		throw new Errors.BadRequestError('Số lượng không được âm');
	}

	if (quantity > MAX_QUANTITY_PER_ITEM) {
		throw new Errors.BadRequestError(
			`Vượt quá số lượng tối đa ${MAX_QUANTITY_PER_ITEM} sản phẩm`,
		);
	}

	const cart = await CartModel.findOne({ buyerId });
	if (!cart) {
		throw new Errors.NotFoundError('Không tìm thấy giỏ hàng');
	}
	const item = cart.findItem(productId, variantId);

	if (!item) {
		throw new Errors.NotFoundError('Sản phẩm không có trong giỏ hàng');
	}

	if (quantity === 0) {
		// Xóa item nếu số lượng = 0
		cart.items = cart.items.filter(
			(i) =>
				!(
					i.productId.toString() === productId.toString() &&
					(!variantId ||
						i.variantId?.toString() === variantId.toString())
				),
		);
	} else {
		// Kiểm tra stock cho variant
		if (variantId) {
			const variant = await VariantModel.findById(variantId);
			if (variant && variant.stock < quantity) {
				throw new Errors.BadRequestError(
					`Chỉ còn ${variant.stock} sản phẩm trong kho`,
				);
			}
		}
		item.quantity = quantity;
	}

	cart.recalculateTotals();
	await cart.save();

	return cart;
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (buyerId, productId, variantId = null) => {
	const cart = await CartModel.findOne({ buyerId });
	if (!cart) {
		throw new Errors.NotFoundError('Không tìm thấy giỏ hàng');
	}

	const initialCount = cart.items.length;

	cart.items = cart.items.filter(
		(item) =>
			!(
				item.productId.toString() === productId.toString() &&
				(!variantId ||
					item.variantId?.toString() === variantId.toString())
			),
	);

	if (cart.items.length === initialCount) {
		throw new Errors.NotFoundError('Sản phẩm không có trong giỏ hàng');
	}

	cart.recalculateTotals();
	await cart.save();

	return cart;
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (userId) => {
	const cart = await getUserCart(userId);
	cart.items = [];
	cart.appliedCoupon = null;
	cart.recalculateTotals();
	await cart.save();

	return cart;
};

// Mã giảm giá mẫu
const COUPONS = {
	SAVE10: {
		discountAmount: 10,
		discountType: 'PERCENTAGE',
		minimumOrderAmount: 100000,
	},
	SAVE50K: {
		discountAmount: 50000,
		discountType: 'FIXED_AMOUNT',
		minimumOrderAmount: 200000,
	},
	NEWUSER: {
		discountAmount: 15,
		discountType: 'PERCENTAGE',
		minimumOrderAmount: 50000,
	},
};

// Áp dụng coupon
export const applyCoupon = async (userId, couponCode) => {
	if (!couponCode) {
		throw new Errors.BadRequestError('Mã giảm giá là bắt buộc');
	}

	const cart = await getUserCart(userId);

	if (cart.items.length === 0) {
		throw new Errors.BadRequestError(
			'Giỏ hàng trống, không thể áp dụng mã giảm giá',
		);
	}

	const coupon = COUPONS[couponCode];
	if (!coupon) {
		throw new Errors.NotFoundError('Mã giảm giá không tồn tại');
	}

	if (cart.totalPrice < coupon.minimumOrderAmount) {
		throw new Errors.BadRequestError(
			`Đơn hàng tối thiểu ${coupon.minimumOrderAmount.toLocaleString(
				'vi-VN',
			)}đ để áp dụng mã giảm giá`,
		);
	}

	cart.appliedCoupon = { code: couponCode, ...coupon };
	cart.recalculateTotals();
	await cart.save();

	return cart;
};

// Xóa coupon
export const removeCoupon = async (userId) => {
	const cart = await getUserCart(userId);
	cart.appliedCoupon = null;
	cart.recalculateTotals();
	await cart.save();

	return cart;
};

// Lấy thông tin tóm tắt giỏ hàng
export const getCartSummary = async (userId) => {
	const cart = await getUserCart(userId);

	// Lọc ra các sản phẩm chưa bị đánh dấu xóa
	const activeItems = cart.itemsBySeller.flatMap((seller) =>
		seller.products.filter((product) => !product._destroy),
	);

	return {
		totalItems: activeItems.length,
		totalQuantity: activeItems.reduce(
			(sum, item) => sum + item.quantity,
			0,
		),
		totalPrice: cart.totalPrice,
		hasCoupon: !!cart.appliedCoupon,
		couponCode: cart.appliedCoupon?.code || null,
		discountAmount: cart.appliedCoupon
			? cart.appliedCoupon.discountType === 'PERCENTAGE'
				? cart.totalPrice * (cart.appliedCoupon.discountAmount / 100)
				: cart.appliedCoupon.discountAmount
			: 0,
	};
};

export const removeItemsFromCart = async (buyerId, orderItems) => {
	const cart = await CartModel.findOne({ buyerId });
	if (!cart) {
		throw new Errors.NotFoundError('Không tìm thấy giỏ hàng');
	}
	// Lấy danh sách productId cần đánh dấu xóa
	const productIdsToRemove = orderItems.map((item) => item.productId);
	// Đánh dấu các sản phẩm đã thanh toán thành _destroy = true
	cart.items.forEach((item) => {
		if (productIdsToRemove.toString().includes(item.productId.toString())) {
			item._destroy = true;
		}
	});

	await cart.save();
	return cart;
};

export const getCartByBuyerId = async (buyerId) => {
	const cart = await CartModel.findOne({ buyer: buyerId }).populate({
		path: 'items.productId',
		select: 'title thumbnail price condition attributes',
	});

	if (!cart) {
		return null;
	}

	// Lọc ra các sản phẩm chưa bị đánh dấu xóa
	cart.items = cart.items.filter((item) => !item._destroy);

	return cart;
};
