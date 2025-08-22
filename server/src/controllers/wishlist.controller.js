import * as WishlistService from '../services/wishlist.service.js';
import Success from '../common/response/success.response.js';

// Thêm sản phẩm vào wishlist
export const addToWishlist = async (req, res, next) => {
	try {
		const { productId } = req.body;
		const result = await WishlistService.addToWishlist(
			req.user.id,
			productId,
		);

		return new Success.Created({
			message: result.message,
			data: result.wishlistItem,
			isInWishlist: result.isInWishlist,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = async (req, res, next) => {
	try {
		const { productId } = req.params;

		if (!productId) {
			return res.status(400).json({
				message: 'ProductId là bắt buộc',
			});
		}

		const result = await WishlistService.removeFromWishlist(
			req.user.id,
			productId,
		);

		return new Success.Ok({
			message: result.message,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Lấy danh sách wishlist của user
export const getUserWishlist = async (req, res, next) => {
	try {
		const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

		const result = await WishlistService.getUserWishlist(req.user.id, {
			page: parseInt(page),
			limit: parseInt(limit),
			sort,
		});

		return new Success.Ok({
			message: 'Lấy danh sách yêu thích thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Kiểm tra sản phẩm có trong wishlist không
export const checkWishlistStatus = async (req, res, next) => {
	try {
		const { productId } = req.params;

		if (!productId) {
			return res.status(400).json({
				message: 'ProductId là bắt buộc',
			});
		}

		const result = await WishlistService.checkWishlistStatus(
			req.user.id,
			productId,
		);

		return new Success.Ok({
			message: 'Kiểm tra trạng thái yêu thích thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Lấy số lượng wishlist của user
export const getWishlistCount = async (req, res, next) => {
	try {
		const result = await WishlistService.getWishlistCount(req.user.id);

		return new Success.Ok({
			message: 'Lấy số lượng yêu thích thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Xóa tất cả wishlist của user
export const clearWishlist = async (req, res, next) => {
	try {
		const result = await WishlistService.clearWishlist(req.user.id);

		return new Success.Ok({
			message: result.message,
		}).send(res);
	} catch (error) {
		next(error);
	}
};
// Toggle wishlist (thêm/xóa)
export const toggleWishlist = async (req, res, next) => {
	try {
		const { productId } = req.body;

		if (!productId) {
			return res.status(400).json({
				message: 'ProductId là bắt buộc',
			});
		}

		// Kiểm tra trạng thái hiện tại
		const status = await WishlistService.checkWishlistStatus(
			req.user.id,
			productId,
		);

		let result;
		if (status.isInWishlist) {
			// Nếu đã có trong wishlist thì xóa
			result = await WishlistService.removeFromWishlist(
				req.user.id,
				productId,
			);
		} else {
			// Nếu chưa có thì thêm vào
			result = await WishlistService.addToWishlist(
				req.user.id,
				productId,
			);
		}

		return new Success.Ok({
			message: result.message,
			data: {
				isInWishlist: !status.isInWishlist,
			},
		}).send(res);
	} catch (error) {
		next(error);
	}
};
