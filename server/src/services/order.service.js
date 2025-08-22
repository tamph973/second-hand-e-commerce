import OrderModel from '../models/order.model.js';
import Errors from '../common/response/error.response.js';
import PaymentModel from '../models/payment.model.js';
import { calculateSellerAmount } from '../utils/helpers.js';
import { sendNotification } from '../server.js';
import ProductModel from '../models/product.model.js';
import { generateOrderCode } from '../utils/helpers.js';

export const createOrder = async (buyerId, orderData) => {
	const {
		cartItems,
		shippingFee,
		shippingAddress,
		totalAmount,
		paymentMethod,
		discount,
	} = orderData;
	// Nhóm sản phẩm theo seller
	const sellerGroups = cartItems.reduce((groups, item) => {
		const sellerId = item.sellerId;
		if (!groups[sellerId]) {
			groups[sellerId] = [];
		}
		groups[sellerId].push(item);
		return groups;
	}, {});

	const orders = await Promise.all(
		Object.entries(sellerGroups).map(async ([sellerId, items]) => {
			const subTotal = items[0].products.reduce((sum, item) => {
				return sum + item.price * item.quantity;
			}, 0);
			const order = await OrderModel.create({
				orderCode: generateOrderCode(),
				buyer: buyerId,
				seller: sellerId,
				items: items[0].products.map((item) => ({
					productId: item.id,
					quantity: item.quantity,
					price: item.price,
				})),
				discount,
				subTotal,
				shippingFee,
				totalAmount: subTotal + shippingFee - discount,
				shippingAddress,
				status: 'PENDING',
			});
			return order;
		}),
	);

	// Tạo hoặc tìm payment record
	let payment = await PaymentModel.findOne({
		buyer: buyerId,
		orderIds: { $all: orders.map((order) => order._id) },
		status: 'UNPAID',
	});

	// Tạo payment
	if (!payment) {
		payment = await PaymentModel.create({
			buyer: buyerId,
			orderIds: orders.map((order) => order._id),
			paymentMethod,
			totalAmount,
			sellers: orders.map((order) => ({
				sellerId: order.seller,
				escrowAmount: calculateSellerAmount(order.subTotal),
				escrowStatus: 'HOLD',
				holdUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 phút
			})),
		});
		orders.forEach(async (order) => {
			order.paymentId = payment._id;
			await order.save();
		});
	}

	return orders;
};

// Lấy chi tiết đơn hàng của buyer
export const getOrderDetail = async (orderId) => {
	const order = await OrderModel.findOne({ _id: orderId })
		.populate({
			path: 'shippingAddress',
			select: 'fullName phoneNumber wardName districtName provinceName  addressDetail',
		})
		.populate({
			path: 'buyer',
			select: 'fullName phoneNumber',
		})
		.populate({
			path: 'items.productId',
			select: 'title thumbnail condition attributes price',
		})
		.populate({
			path: 'seller',
			select: 'fullName avatar',
		})
		.populate({
			path: 'paymentId',
			select: 'status paymentMethod',
		});
	if (!order) {
		throw new Errors.NotFoundError('Không tìm thấy đơn hàng');
	}
	return {
		orderId: order._id,
		buyerInfo: {
			fullName: order.buyer.fullName,
			phoneNumber: order.buyer.phoneNumber,
		},
		sellerInfo: {
			sellerId: order.seller._id,
			fullName: order.seller.fullName,
			avatar: order.seller.avatar.url,
		},
		createdAt: order.createdAt,
		items: order.items.map((item) => ({
			productId: item.productId._id,
			title: item.productId.title,
			thumbnail: item.productId.thumbnail.url,
			condition: item.productId.condition,
			attributes: item.productId.attributes,
			quantity: item.quantity,
			price: item.price,
		})),
		subTotal: order.subTotal,
		shippingFee: order.shippingFee,
		shippingAddress: order.shippingAddress,
		discount: order.discount,
		totalAmount: order.totalAmount,
		status: order.status,
		paymentStatus: order.paymentId.status,
		paymentMethod: order.paymentId.paymentMethod,
	};
};

// Lấy danh sách đơn hàng của buyer
export const getAllOrders = async (buyerId) => {
	const orders = await OrderModel.find({ buyer: buyerId })
		.populate({
			path: 'shippingAddress',
			select: 'wardName districtName provinceName addressDetail',
		})
		.populate({
			path: 'buyer',
			select: 'fullName phoneNumber',
		})
		.populate({
			path: 'items.productId',
			select: 'title thumbnail condition attributes price slug',
		})
		.populate({
			path: 'seller',
			select: 'fullName avatar',
		})
		.populate({
			path: 'paymentId',
			select: 'status paymentMethod _id',
		});

	const flatOrders = [];
	orders.forEach((order) => {
		flatOrders.push({
			orderId: order._id,
			buyerInfo: {
				fullName: order.buyer.fullName,
				phoneNumber: order.buyer.phoneNumber,
			},
			sellerInfo: {
				sellerId: order.seller._id,
				fullName: order.seller.fullName,
				avatar: order.seller.avatar.url,
			},
			createdAt: order.createdAt,
			items: order.items.map((item) => ({
				productId: item.productId._id,
				title: item.productId.title,
				slug: item.productId.slug,
				thumbnail: item.productId.thumbnail.url,
				condition: item.productId.condition,
				attributes: item.productId.attributes,
				quantity: item.quantity,
				price: item.price,
			})),
			subTotal: order.subTotal,
			shippingFee: order.shippingFee,
			shippingAddress: order.shippingAddress,
			discount: order.discount,
			totalAmount: order.totalAmount,
			status: order.status,
			paymentStatus: order.paymentId.status,
			paymentId: order.paymentId._id,
		});
	});
	return flatOrders;
};

export const updateOrder = async (orderData) => {
	const { orderId, shippingFee, shippingAddress, paymentMethod } = orderData;
	const order = await OrderModel.findOne({ _id: orderId });
	if (!order) {
		throw new Errors.NotFoundError('Không tìm thấy đơn hàng');
	}

	if (order) {
		const payment = await PaymentModel.create({
			buyer: order.buyer,
			orderIds: [order._id],
			paymentMethod,
			totalAmount: order.subTotal + order.shippingFee,
			sellers: [
				{
					sellerId: order.seller,
					escrowAmount: calculateSellerAmount(order.subTotal),
					escrowStatus: 'HOLD',
					holdUntil: new Date(Date.now() + 10 * 60 * 1000),
				},
			],
		});
		order.paymentId = payment._id;
		// cập nhật shippingFee, shippingAddress nếu cần
		if (shippingFee) {
			order.shippingFee = shippingFee;
		}
		if (shippingAddress) {
			order.shippingAddress = shippingAddress;
		}
		await order.save();
		return order;
	}
};

// Lấy đơn hàng theo seller
export const getSellerOrders = async (sellerId) => {
	const orders = await OrderModel.find({ seller: sellerId })
		.sort({ createdAt: -1 })
		.populate({
			path: 'shippingAddress',
			select: 'wardName districtName provinceName  addressDetail',
		})
		.populate({
			path: 'buyer',
			select: 'fullName phoneNumber',
		})
		.populate({
			path: 'items.productId',
			select: 'title thumbnail condition attributes price',
		})
		.populate({
			path: 'paymentId',
			select: 'status paymentMethod',
		});
	const flatOrders = [];
	orders.forEach((order) => {
		flatOrders.push({
			orderId: order._id,
			buyerInfo: {
				fullName: order.buyer.fullName,
				phoneNumber: order.buyer.phoneNumber,
			},
			sellerInfo: {
				sellerId: order.seller._id,
				fullName: order.seller.fullName,
			},
			createdAt: order.createdAt,
			items: order.items.map((item) => ({
				productId: item.productId._id,
				title: item.productId.title,
				slug: item.productId.slug,
				thumbnail: item.productId.thumbnail.url,
				condition: item.productId.condition,
				attributes: item.productId.attributes,
				quantity: item.quantity,
				price: item.price,
			})),
			subTotal: order.subTotal,
			shippingFee: order.shippingFee,
			shippingAddress: order.shippingAddress,
			discount: order.discount,
			totalAmount: order.totalAmount,
			status: order.status,
			paymentStatus: order.paymentId.status,
		});
	});
	return flatOrders;
};

// Cập nhật trạng thái đơn hàng (chỉ có seller mới có thể cập nhật)
export const updateOrderStatus = async (orderId, status) => {
	const order = await OrderModel.findOne({ _id: orderId });
	if (!order) {
		throw new Errors.NotFoundError('Không tìm thấy đơn hàng');
	}
	order.status = status;
	await order.save();

	// Nếu trạng thái mới là DELIVERED và phương thức thanh toán là COD thì cập nhật payment.status = 'PAID'
	if (status === 'DELIVERED' && order.paymentId) {
		const payment = await PaymentModel.findById(order.paymentId);
		if (
			payment &&
			payment.paymentMethod === 'COD' &&
			payment.status !== 'PAID'
		) {
			payment.status = 'PAID';
			await payment.save();
		}
	}

	if (status === 'COMPLETED') {
		order.items.forEach(async (item) => {
			const product = await ProductModel.findById(item.productId);
			product.sold += item.quantity;
			product.stock -= item.quantity;
			await product.save();
		});
	}

	// Gửi thông báo real-time
	const recipients = {
		users: [order.buyer],
		sellers: [order.seller],
	};

	sendNotification('user', recipients.users, {
		event: 'order-update',
		orderId: order._id,
		userId: order.buyer,
		status: status,
		message: `Đơn hàng #${order._id} đã được cập nhật trạng thái thành ${status}`,
	});

	sendNotification('seller', recipients.sellers, {
		event: 'order-update',
		orderId: order._id,
		sellerId: order.seller,
		status: status,
		message: `Đơn hàng #${order._id} của bạn đã được cập nhật trạng thái thành ${status}`,
	});

	return order;
};

// Hủy đơn hàng (người mua hủy)
export const cancelOrder = async (orderId, reason) => {
	const order = await OrderModel.findOne({ _id: orderId });
	if (!order) {
		throw new Errors.NotFoundError('Không tìm thấy đơn hàng');
	}
	order.status = 'CANCELLED';
	// order.cancelReason = reason;
	await order.save();
};
