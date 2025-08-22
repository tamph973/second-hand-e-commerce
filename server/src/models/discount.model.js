import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		couponType: {
			type: String,
			enum: ['DISCOUNT_ON_PURCHASE', 'DISCOUNT_ON_SHIPPING'],
			default: 'DISCOUNT_ON_PURCHASE',
		},
		code: {
			type: String,
			required: true,
			unique: true,
		},
		discountType: {
			type: String,
			enum: ['PERCENT', 'FIXED'],
			default: 'PERCENT',
		},
		amount: {
			type: Number,
			required: true,
		},
		minimumPurchase: {
			// số tiền tối thiểu để áp dụng
			type: Number,
		},
		maximumDiscount: {
			// số tiền giảm tối đa
			type: Number,
		},
		limitUsage: {
			// số lần sử dụng tối đa
			type: Number,
			required: true,
		},
		// Thêm trường để xác định loại mã giảm giá
		discountScope: {
			type: String,
			enum: ['PUBLIC', 'PRIVATE'], // PUBLIC: cho tất cả, PRIVATE: cho người dùng cụ thể
			default: 'PUBLIC',
		},
		// Danh sách userId được phép sử dụng (chỉ áp dụng khi discountScope = 'PRIVATE')
		allowedUsers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		// Hoặc có thể dùng userId đơn lẻ nếu chỉ cho 1 user
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		status: {
			type: String,
			enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'],
			default: 'ACTIVE',
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const DiscountModel = mongoose.model('Discount', discountSchema);

export default DiscountModel;
