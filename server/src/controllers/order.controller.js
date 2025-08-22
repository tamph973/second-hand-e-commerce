import * as OrderService from '../services/order.service.js';
import Success from '../common/response/success.response.js';
import OrderModel from '../models/order.model.js';
import * as PaymentService from '../services/payment.service.js';
import { removeItemsFromCart } from '../services/cart.service.js';
import { sendNotification } from '../server.js';

export const createOrder = async (req, res, next) => {
	try {
		const order = await OrderService.createOrder(req.user.id, req.body);
		return new Success.Ok({
			message: 'Tạo đơn hàng thành công',
			data: order,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const getAllOrders = async (req, res, next) => {
	try {
		const orders = await OrderService.getAllOrders(req.user.id);
		return new Success.Ok({
			message: 'Lấy tất cả đơn hàng thành công',
			orders,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const getOrderDetail = async (req, res, next) => {
	try {
		const order = await OrderService.getOrderDetail(req.params.orderId);
		return new Success.Ok({
			message: 'Lấy đơn hàng thành công',
			data: order,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const updateOrder = async (req, res, next) => {
	try {
		const order = await OrderService.updateOrder(req.body);
		return new Success.Ok({
			message: 'Cập nhật đơn hàng thành công',
			data: order,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const getSellerOrders = async (req, res, next) => {
	try {
		const orders = await OrderService.getSellerOrders(req.user.id);
		return new Success.Ok({
			message: 'Lấy đơn hàng thành công',
			orders,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const updateOrderStatus = async (req, res, next) => {
	try {
		const order = await OrderService.updateOrderStatus(
			req.params.orderId,
			req.body.status,
		);
		return new Success.Ok({
			message: 'Cập nhật trạng thái đơn hàng thành công',
			data: order,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const confirmOrderReceived = async (req, res, next) => {
	try {
		const { orderId } = req.params;
		// 1. Cập nhật trạng thái đơn hàng

		// 2. Giải phóng tiền cho seller liên quan đến đơn hàng này
		const order = await PaymentService.handlePaymentForSeller(orderId);

		if (order?.status === 'COMPLETED') {
			// 3. Khi người mua xác nhận nhận hàng, gửi thông báo cho người bán
			sendNotification('seller', [order.seller], {
				event: 'order-update',
				orderId: order._id,
				sellerId: order.seller,
				status: 'COMPLETED',
				message: `Người mua đã xác nhận nhận hàng, đơn hàng #${order._id}`,
			});

			// Lấy tất cả đơn hàng để xóa sản phẩm khỏi giỏ hàng
			const orders = await OrderModel.find({ _id: orderId });
			const allOrderItems = [];

			orders.forEach((order) => {
				allOrderItems.push(...order.items);
			});

			// Xóa sản phẩm đã thanh toán khỏi giỏ hàng
			if (allOrderItems.length > 0) {
				await removeItemsFromCart(order.buyer, allOrderItems);
			}
		}

		return new Success.Ok({
			message: 'Đã xác nhận và giải ngân cho người bán',
			data: order,
		}).send(res);
	} catch (err) {
		next(err);
	}
};

export const cancelOrder = async (req, res, next) => {
	try {
		const { orderId } = req.params;
		const order = await OrderService.cancelOrder(orderId, req.body);
		return new Success.Ok({
			message: 'Đã hủy đơn hàng thành công',
			data: order,
		}).send(res);
	} catch (err) {
		next(err);
	}
};
