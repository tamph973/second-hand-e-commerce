import mongoose from 'mongoose';
import DiscountModel from '../models/discount.model.js';
import DiscountUsageModel from '../models/discountUsage.model.js';
import Errors from '../common/response/error.response.js';

export async function createDiscount(data) {
	// Kiểm tra code đã tồn tại chưa
	const existingDiscount = await DiscountModel.findOne({ code: data.code });
	if (existingDiscount) {
		throw new Errors.BadRequestError('Mã giảm giá đã tồn tại');
	}

	// Kiểm tra ngày bắt đầu và kết thúc
	if (new Date(data.startDate) >= new Date(data.endDate)) {
		throw new Errors.BadRequestError(
			'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
		);
	}

	// Thêm người dùng vào allowedUsers nếu discountScope là PRIVATE
	if (data.discountScope === 'PRIVATE' && data.userId) {
		data.allowedUsers = [data.userId];
	}

	const newDiscount = await DiscountModel.create(data);
	return newDiscount;
}

export async function updateDiscount(discountId, data) {
	const existingDiscount = await DiscountModel.findById(discountId);
	if (!existingDiscount) {
		throw new Errors.BadRequestError('Không tìm thấy mã giảm giá');
	}

	// Nếu cập nhật code, kiểm tra code mới có trùng không
	if (data.code && data.code !== existingDiscount.code) {
		const codeExists = await DiscountModel.findOne({
			code: data.code,
			_id: { $ne: discountId },
		});
		if (codeExists) {
			throw new Errors.BadRequestError('Mã giảm giá đã tồn tại');
		}
	}

	// Kiểm tra ngày bắt đầu và kết thúc nếu có cập nhật
	if (data.startDate && data.endDate) {
		if (new Date(data.startDate) >= new Date(data.endDate)) {
			throw new Errors.BadRequestError(
				'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
			);
		}
	}

	const updatedDiscount = await DiscountModel.findByIdAndUpdate(
		discountId,
		{ $set: data },
		{ new: true },
	);

	return updatedDiscount;
}

export async function deleteDiscount(discountId) {
	const existingDiscount = await DiscountModel.findById(discountId);
	if (!existingDiscount) {
		throw new Errors.BadRequestError('Không tìm thấy mã giảm giá');
	}

	return await DiscountModel.findByIdAndDelete(discountId);
}

export async function getDiscountById(discountId) {
	const discount = await DiscountModel.findById(discountId);
	if (!discount) {
		throw new Errors.BadRequestError('Không tìm thấy mã giảm giá');
	}
	return discount;
}

export async function getAllDiscounts(query = {}) {
	const { page = 1, limit = 10, status, search } = query;

	let filter = {};

	// Lọc theo trạng thái
	if (status) {
		filter.status = status;
	}

	// Tìm kiếm theo title hoặc code
	if (search) {
		filter.$or = [
			{ title: { $regex: search, $options: 'i' } },
			{ code: { $regex: search, $options: 'i' } },
		];
	}

	const skip = (page - 1) * limit;

	const discounts = await DiscountModel.find(filter)
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(parseInt(limit));

	const total = await DiscountModel.countDocuments(filter);

	return {
		discounts,
		pagination: {
			page: parseInt(page),
			limit: parseInt(limit),
			total,
			pages: Math.ceil(total / limit),
		},
	};
}

export async function getActiveDiscounts() {
	const now = new Date();
	return await DiscountModel.find({
		status: 'ACTIVE',
		startDate: { $lte: now },
		endDate: { $gte: now },
	}).sort({ createdAt: -1 });
}

export async function getDiscountsForUser(userId) {
	const now = new Date();

	// Lấy tất cả mã giảm giá công khai và mã riêng tư dành cho user này
	const discounts = await DiscountModel.find({
		status: 'ACTIVE',
		startDate: { $lte: now },
		endDate: { $gte: now },
		$or: [
			{ discountScope: 'PUBLIC' },
			{
				discountScope: 'PRIVATE',
				$or: [{ userId: userId }, { allowedUsers: { $in: [userId] } }],
			},
		],
	}).sort({ createdAt: -1 });

	return discounts;
}

export async function validateDiscountCode(code, userId, totalAmount) {
	const discount = await DiscountModel.findOne({
		code: code.toUpperCase(),
		status: 'ACTIVE',
	});

	if (!discount) {
		throw new Errors.BadRequestError('Mã giảm giá không hợp lệ');
	}

	const now = new Date();
	if (now < discount.startDate || now > discount.endDate) {
		throw new Errors.BadRequestError(
			'Mã giảm giá đã hết hạn hoặc chưa có hiệu lực',
		);
	}

	// Kiểm tra phạm vi áp dụng
	if (discount.discountScope === 'PRIVATE') {
		// Kiểm tra xem user có được phép sử dụng không
		const isUserAllowed =
			(discount.userId &&
				discount.userId.toString() === userId.toString()) ||
			(discount.allowedUsers &&
				discount.allowedUsers.some(
					(id) => id.toString() === userId.toString(),
				));

		if (!isUserAllowed) {
			throw new Errors.BadRequestError(
				'Mã giảm giá này chỉ dành cho người dùng cụ thể',
			);
		}
	}

	if (totalAmount < discount.minimumPurchase) {
		throw new Errors.BadRequestError(
			`Đơn hàng tối thiểu phải là ${discount.minimumPurchase.toLocaleString(
				'vi-VN',
			)} VNĐ`,
		);
	}

	// Kiểm tra số lần sử dụng của user
	const usageCount = await DiscountUsageModel.countDocuments({
		userId,
		discountId: discount._id,
	});

	if (usageCount >= discount.limitUsage) {
		throw new Errors.BadRequestError(
			'Bạn đã sử dụng hết số lần cho phép của mã giảm giá này',
		);
	}

	return discount;
}

export async function calculateDiscountAmount(discount, totalAmount) {
	let discountAmount = 0;

	if (discount.discountType === 'PERCENT') {
		discountAmount = (totalAmount * discount.amount) / 100;
	} else {
		discountAmount = discount.amount;
	}

	// Giới hạn số tiền giảm tối đa
	if (discountAmount > discount.maximumDiscount) {
		discountAmount = discount.maximumDiscount;
	}

	return discountAmount;
}

export async function recordDiscountUsage(
	userId,
	discountId,
	orderId,
	discountAmount,
) {
	return await DiscountUsageModel.create({
		userId,
		discountId,
		orderId,
		discountAmount,
	});
}

export async function getUserDiscountUsage(userId, discountId) {
	return await DiscountUsageModel.find({
		userId,
		discountId,
	}).populate('orderId', 'orderNumber totalAmount createdAt');
}

export async function getDiscountUsageStats(discountId) {
	const usageStats = await DiscountUsageModel.aggregate([
		{ $match: { discountId: new mongoose.Types.ObjectId(discountId) } },
		{
			$group: {
				_id: null,
				totalUsage: { $sum: 1 },
				totalDiscountAmount: { $sum: '$discountAmount' },
			},
		},
	]);

	return usageStats[0] || { totalUsage: 0, totalDiscountAmount: 0 };
}
