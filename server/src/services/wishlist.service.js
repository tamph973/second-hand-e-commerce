import WishlistModel from '../models/wishlist.model.js';
import ProductModel from '../models/product.model.js';
import userModel from '../models/user.model.js';
import Errors from '../common/response/error.response.js';

// Toggle wishlist (thêm/xóa sản phẩm)
export const addToWishlist = async (userId, productId) => {
	try {
		// Kiểm tra user có tồn tại không
		const user = await userModel.findById(userId);
		if (!user) {
			throw new Errors.NotFoundError('Không tìm thấy người dùng');
		}

		// Kiểm tra sản phẩm có tồn tại không
		const product = await ProductModel.findOne({
			_id: productId,
			_destroy: false,
		});
		if (!product) {
			throw new Errors.NotFoundError('Không tìm thấy sản phẩm');
		}

		// Kiểm tra sản phẩm đã có trong wishlist chưa
		const existingWishlist = await WishlistModel.findOne({
			userId,
			productId,
		});

		if (existingWishlist) {
			// Nếu đã có trong wishlist thì xóa
			await WishlistModel.deleteOne({ _id: existingWishlist._id });

			// Cập nhật user model
			user.wishlist = user.wishlist.filter(
				(id) => id.toString() !== productId.toString(),
			);
			product.wishlist = product.wishlist - 1;
			await product.save();
			await user.save();

			return {
				message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
				isInWishlist: false,
			};
		} else {
			// Nếu chưa có thì thêm vào
			const wishlistItem = await WishlistModel.create({
				userId,
				productId: product._id,
			});

			// Cập nhật user model
			if (!user.wishlist.includes(product._id)) {
				user.wishlist.push(product._id);
				await user.save();
				product.wishlist = product.wishlist + 1;
				await product.save();
			}

			return {
				message: 'Sản phẩm vào danh sách yêu thích',
				wishlistItem,
				isInWishlist: true,
			};
		}
	} catch (error) {
		if (error instanceof Errors.BaseError) {
			throw error;
		}
		throw new Errors.InternalServerError('Lỗi khi thao tác với wishlist');
	}
};

// Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = async (userId, productId) => {
	try {
		// Kiểm tra user có tồn tại không
		const user = await userModel.findById(userId);
		if (!user) {
			throw new Errors.NotFoundError('Không tìm thấy người dùng');
		}

		// Tìm và xóa wishlist item
		const wishlistItem = await WishlistModel.findOneAndDelete({
			userId,
			productId,
		});

		if (!wishlistItem) {
			throw new Errors.NotFoundError(
				'Sản phẩm không có trong danh sách yêu thích',
			);
		}

		// Cập nhật wishlist trong user model
		user.wishlist = user.wishlist.filter(
			(id) => id.toString() !== productId.toString(),
		);
		await user.save();

		return {
			message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
		};
	} catch (error) {
		if (error instanceof Errors.BaseError) {
			throw error;
		}
		throw new Errors.InternalServerError('Lỗi khi xóa khỏi wishlist');
	}
};

// Lấy danh sách wishlist của user
export const getUserWishlist = async (userId, options = {}) => {
	try {
		const { page = 1, limit = 10, sort = '-createdAt' } = options;

		// Kiểm tra user có tồn tại không
		const user = await userModel.findById(userId);
		if (!user) {
			throw new Errors.NotFoundError('Không tìm thấy người dùng');
		}

		// Tính toán pagination
		const skip = (page - 1) * limit;

		// Lấy wishlist với populate product
		const wishlistItems = await WishlistModel.find({ userId })
			.populate({
				path: 'productId',
				match: { _destroy: false }, // Chỉ lấy sản phẩm chưa bị xóa
			})
			.sort(sort)
			.skip(skip)
			.limit(limit);

		// Lọc bỏ các item có product null (đã bị xóa)
		const validWishlistItems = wishlistItems.filter(
			(item) => item.productId !== null,
		);

		// Đếm tổng số wishlist items
		const total = await WishlistModel.countDocuments({ userId });

		return {
			wishlistItems: validWishlistItems,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	} catch (error) {
		if (error instanceof Errors.BaseError) {
			throw error;
		}
		throw new Errors.InternalServerError('Lỗi khi lấy danh sách wishlist');
	}
};

// Kiểm tra sản phẩm có trong wishlist không
export const checkWishlistStatus = async (userId, productId) => {
	try {
		const wishlistItem = await WishlistModel.findOne({
			userId,
			productId,
		});

		return {
			isInWishlist: !!wishlistItem,
			wishlistItem: wishlistItem || null,
		};
	} catch (error) {
		throw new Errors.InternalServerError(
			'Lỗi khi kiểm tra trạng thái wishlist',
		);
	}
};

// Lấy số lượng wishlist của user
export const getWishlistCount = async (userId) => {
	try {
		const count = await WishlistModel.countDocuments({ userId });
		return { count };
	} catch (error) {
		throw new Errors.InternalServerError('Lỗi khi đếm số lượng wishlist');
	}
};

// Xóa tất cả wishlist của user
export const clearWishlist = async (userId) => {
	try {
		// Kiểm tra user có tồn tại không
		const user = await userModel.findById(userId);
		if (!user) {
			throw new Errors.NotFoundError('Không tìm thấy người dùng');
		}

		// Xóa tất cả wishlist items
		await WishlistModel.deleteMany({ userId });

		// Cập nhật user model
		user.wishlist = [];
		await user.save();

		return {
			message: 'Đã xóa tất cả sản phẩm khỏi danh sách yêu thích',
		};
	} catch (error) {
		if (error instanceof Errors.BaseError) {
			throw error;
		}
		throw new Errors.InternalServerError('Lỗi khi xóa wishlist');
	}
};
