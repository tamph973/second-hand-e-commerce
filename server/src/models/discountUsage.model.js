import mongoose from 'mongoose';

const discountUsageSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		discountId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Discount',
			required: true,
		},
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Order',
			required: true,
		},
		discountAmount: {
			type: Number,
			required: true,
		},
		usedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	},
);

// Tạo index để tối ưu query
discountUsageSchema.index({ userId: 1, discountId: 1 });
discountUsageSchema.index({ orderId: 1 });

const DiscountUsageModel = mongoose.model('DiscountUsage', discountUsageSchema);

export default DiscountUsageModel;
