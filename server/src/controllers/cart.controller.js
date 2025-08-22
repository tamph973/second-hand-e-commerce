import * as CartService from '../services/cart.service.js';
import Success from '../common/response/success.response.js';

// Lấy giỏ hàng của user
export const getUserCart = async (req, res, next) => {
	try {
		const cart = await CartService.getUserCart(req.user.id);
		return new Success.Ok({
			message: 'Lấy giỏ hàng thành công',
			data: cart,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res, next) => {
	try {
		const { productId, variantId, quantity = 1 } = req.body;

		const cart = await CartService.addToCart(
			req.user.id,
			productId,
			variantId,
			quantity,
		);

		return new Success.Created({
			message: 'Thêm sản phẩm vào giỏ hàng thành công',
			data: cart,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = async (req, res, next) => {
	try {
		const { productId, variantId, quantity } = req.body;

		const cart = await CartService.updateCartItemQuantity(
			req.user.id,
			productId,
			variantId,
			quantity,
		);

		return new Success.Ok({
			message: 'Cập nhật số lượng thành công',
			data: cart,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res, next) => {
	try {
		const { productId, variantId } = req.body;

		const cart = await CartService.removeFromCart(
			req.user.id,
			productId,
			variantId,
		);

		return new Success.Ok({
			message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
			data: cart,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req, res, next) => {
	try {
		const cart = await CartService.clearCart(req.user.id);

		return new Success.Ok({
			message: 'Xóa giỏ hàng thành công',
			data: cart,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Áp dụng coupon
export const applyCoupon = async (req, res, next) => {
	try {
		const { couponCode } = req.body;

		if (!couponCode) {
			return res.status(400).json({ message: 'CouponCode là bắt buộc' });
		}

		const cart = await CartService.applyCoupon(req.user.id, couponCode);

		return new Success.Ok({
			message: 'Áp dụng mã giảm giá thành công',
			data: cart,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Xóa coupon
export const removeCoupon = async (req, res, next) => {
	try {
		const cart = await CartService.removeCoupon(req.user.id);

		return new Success.Ok({
			message: 'Xóa mã giảm giá thành công',
			data: cart,
		}).send(res);
	} catch (error) {
		next(error);
	}
};
