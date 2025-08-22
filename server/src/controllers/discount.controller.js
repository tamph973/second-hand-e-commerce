import * as discountService from '../services/discount.service.js';
import Success from '../common/response/success.response.js';
import Errors from '../common/response/error.response.js';

export async function createDiscount(req, res, next) {
	try {
		const discountData = req.body;
		const newDiscount = await discountService.createDiscount(discountData);

		return new Success.Created({
			message: 'Tạo mã giảm giá thành công',
			data: newDiscount,
		}).send(res);
	} catch (error) {
		return next(error);
	}
}

export async function updateDiscount(req, res, next) {
	try {
		const { discountId } = req.params;
		const updateData = req.body;

		const updatedDiscount = await discountService.updateDiscount(
			discountId,
			updateData,
		);

		return new Success.Ok({
			message: 'Cập nhật mã giảm giá thành công',
			data: updatedDiscount,
		}).send(res);
	} catch (error) {
		return next(error);
	}
}

export async function deleteDiscount(req, res, next) {
	try {
		const { discountId } = req.params;

		await discountService.deleteDiscount(discountId);

		return new Success.Ok({
			message: 'Xóa mã giảm giá thành công',
		}).send(res);
	} catch (error) {
		return next(error);
	}
}

export async function getDiscountUsageStats(req, res, next) {
	try {
		const { discountId } = req.params;

		const stats = await discountService.getDiscountUsageStats(discountId);

		return new Success.Ok({
			message: 'Lấy thống kê sử dụng mã giảm giá thành công',
			data: stats,
		}).send(res);
	} catch (error) {
		return next(error);
	}
}

export async function getUserDiscountUsage(req, res, next) {
	try {
		const { discountId } = req.params;
		const { id: userId } = req.user;

		const usage = await discountService.getUserDiscountUsage(
			userId,
			discountId,
		);

		return new Success.Ok({
			message: 'Lấy lịch sử sử dụng mã giảm giá thành công',
			data: usage,
		}).send(res);
	} catch (error) {
		return next(error);
	}
}

export async function getDiscountById(req, res, next) {
	try {
		const { discountId } = req.params;

		const discount = await discountService.getDiscountById(discountId);

		return new Success.Ok({
			message: 'Lấy thông tin mã giảm giá thành công',
			data: discount,
		}).send(res);
	} catch (error) {
		return next(error);
	}
}

export async function getAllDiscounts(req, res, next) {
	try {
		const query = req.query;

		const result = await discountService.getAllDiscounts(query);

		return new Success.Ok({
			message: 'Lấy danh sách mã giảm giá thành công',
			data: result,
		}).send(res);
	} catch (error) {
		return next(error);
	}
}

export async function getActiveDiscounts(req, res, next) {
	try {
		const activeDiscounts = await discountService.getActiveDiscounts();

		return new Success.Ok({
			message: 'Lấy danh sách mã giảm giá đang hoạt động thành công',
			data: activeDiscounts,
		}).send(res);
	} catch (error) {
		return next(error);
	}
}

export async function getDiscountsForUser(req, res, next) {
	try {
		const { id: userId } = req.user;

		const userDiscounts = await discountService.getDiscountsForUser(userId);

		return new Success.Ok({
			message: 'Lấy danh sách mã giảm giá cho người dùng thành công',
			data: userDiscounts,
		}).send(res);
	} catch (error) {
		return next(error);
	}
}

export async function validateDiscountCode(req, res, next) {
	try {
		const { code } = req.body;
		const { id: userId } = req.user;
		const { totalAmount } = req.body;

		if (!code) {
			throw new Errors.BadRequestError('Vui lòng nhập mã giảm giá');
		}

		if (!totalAmount || totalAmount <= 0) {
			throw new Errors.BadRequestError('Tổng tiền đơn hàng không hợp lệ');
		}

		const discount = await discountService.validateDiscountCode(
			code,
			userId,
			totalAmount,
		);
		const discountAmount = await discountService.calculateDiscountAmount(
			discount,
			totalAmount,
		);

		return new Success.Ok({
			message: 'Mã giảm giá hợp lệ',
			data: {
				discount,
				discountAmount,
				finalAmount: totalAmount - discountAmount,
			},
		}).send(res);
	} catch (error) {
		return next(error);
	}
}
