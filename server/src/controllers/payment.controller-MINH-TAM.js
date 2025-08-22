import * as PaymentService from '../services/payment.service.js';
import Success from '../common/response/success.response.js';
import { env } from '../configs/environment.js';

export const vnpayPayment = async (req, res, next) => {
	try {
		const paymentUrl = await PaymentService.vnpayPayment(
			req.user.id,
			req.body,
		);
		return new Success.Ok({
			message: 'Tạo thanh toán thành công',
			data: paymentUrl,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const handleVNPayReturn = async (req, res, next) => {
	try {
		const payment = await PaymentService.handleVNPayReturn(req.query);

		if (payment.vnp_ResponseCode === '00') {
			res.redirect(
				`${env.FRONTEND_URL}/checkout/success/?paymentId=${payment.vnp_TxnRef}`,
			);
		}
	} catch (error) {
		next(error);
	}
};

export const momoPayment = async (req, res, next) => {
	try {
		const data = await PaymentService.momoPayment(req.user.id, req.body);
		return new Success.Ok({
			message: 'Tạo thanh toán thành công',
			data,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const handleMoMoReturn = async (req, res, next) => {
	try {
		const data = await PaymentService.handleMoMoReturn(req.query);

		if (data.resultCode === '0') {
			res.redirect(
				`${env.FRONTEND_URL}/checkout/success/?paymentId=${data.requestId}`,
			);
		}
	} catch (error) {
		next(error);
	}
};

export const releaseEscrow = async (req, res, next) => {
	try {
		const result = await PaymentService.releaseSellerEscrowByOrder();
		return new Success.Ok({
			message: 'Giải phóng tiền cho seller thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Lấy lịch sử thanh toán cho người bán
export const getPaymentHistory = async (req, res, next) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const result = await PaymentService.getPaymentHistory(
			req.user.id,
			page,
			limit,
		);
		return new Success.Ok({
			message: 'Lấy lịch sử thanh toán thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const zaloPayPayment = async (req, res, next) => {
	try {
		const data = await PaymentService.zaloPayPayment();
		return new Success.Ok({
			message: 'Tạo thanh toán thành công',
			data,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const handleQueryZaloPay = async (req, res, next) => {
	try {
		const data = await PaymentService.handleQueryZaloPay(req.query);
		return new Success.Ok({
			message: 'Lấy thông tin thanh toán thành công',
			data,
		}).send(res);
	} catch (error) {
		next(error);
	}
};
