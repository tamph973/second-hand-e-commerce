import mongoose from 'mongoose';

const ImageModerationSchema = new mongoose.Schema(
	{
		// Thông tin file
		filename: { type: String, required: true },
		originalName: { type: String, required: true },
		mimeType: { type: String, required: true },
		size: { type: Number, required: true },

		// Kết quả kiểm duyệt
		isAppropriate: { type: Boolean, required: true },
		confidence: { type: Number, required: true },
		riskLevel: {
			type: String,
			enum: ['LOW', 'MEDIUM', 'HIGH'],
			required: true,
		},

		// Chi tiết phân loại
		categories: [
			{
				name: { type: String, required: true },
				likelihood: {
					type: String,
					enum: [
						'VERY_UNLIKELY',
						'UNLIKELY',
						'POSSIBLE',
						'LIKELY',
						'VERY_LIKELY',
					],
					required: true,
				},
			},
		],
		rejectedCategories: [{ type: String }],
		warnedCategories: [{ type: String }],

		// Liên kết với sản phẩm (nếu có)
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		// Thông tin xử lý
		status: {
			type: String,
			enum: ['PENDING', 'APPROVED', 'REJECTED', 'MANUAL_REVIEW'],
			default: 'PENDING',
		},
		reviewedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		reviewedAt: { type: Date },
		reviewNote: { type: String },

		// Metadata
		ipAddress: { type: String },
		userAgent: { type: String },

		// Xóa mềm
		_destroy: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

// Indexes
ImageModerationSchema.index({ userId: 1, createdAt: -1 });
ImageModerationSchema.index({ productId: 1 });
ImageModerationSchema.index({ status: 1 });
ImageModerationSchema.index({ riskLevel: 1 });
ImageModerationSchema.index({ isAppropriate: 1 });

// Virtual fields
ImageModerationSchema.virtual('isHighRisk').get(function () {
	return this.riskLevel === 'HIGH';
});

ImageModerationSchema.virtual('isMediumRisk').get(function () {
	return this.riskLevel === 'MEDIUM';
});

ImageModerationSchema.virtual('isLowRisk').get(function () {
	return this.riskLevel === 'LOW';
});

// Methods
ImageModerationSchema.methods.approve = function (reviewerId, note = '') {
	this.status = 'APPROVED';
	this.reviewedBy = reviewerId;
	this.reviewedAt = new Date();
	this.reviewNote = note;
	return this.save();
};

ImageModerationSchema.methods.reject = function (reviewerId, note = '') {
	this.status = 'REJECTED';
	this.reviewedBy = reviewerId;
	this.reviewedAt = new Date();
	this.reviewNote = note;
	return this.save();
};

ImageModerationSchema.methods.flagForManualReview = function (
	reviewerId,
	note = '',
) {
	this.status = 'MANUAL_REVIEW';
	this.reviewedBy = reviewerId;
	this.reviewedAt = new Date();
	this.reviewNote = note;
	return this.save();
};

// Static methods
ImageModerationSchema.statics.getStats = async function () {
	const stats = await this.aggregate([
		{ $match: { _destroy: { $ne: true } } },
		{
			$group: {
				_id: null,
				totalChecked: { $sum: 1 },
				appropriateCount: { $sum: { $cond: ['$isAppropriate', 1, 0] } },
				inappropriateCount: {
					$sum: { $cond: ['$isAppropriate', 0, 1] },
				},
				averageConfidence: { $avg: '$confidence' },
				highRiskCount: {
					$sum: { $cond: [{ $eq: ['$riskLevel', 'HIGH'] }, 1, 0] },
				},
				mediumRiskCount: {
					$sum: { $cond: [{ $eq: ['$riskLevel', 'MEDIUM'] }, 1, 0] },
				},
				lowRiskCount: {
					$sum: { $cond: [{ $eq: ['$riskLevel', 'LOW'] }, 1, 0] },
				},
			},
		},
	]);

	return (
		stats[0] || {
			totalChecked: 0,
			appropriateCount: 0,
			inappropriateCount: 0,
			averageConfidence: 0,
			highRiskCount: 0,
			mediumRiskCount: 0,
			lowRiskCount: 0,
		}
	);
};

ImageModerationSchema.statics.getStatsByDateRange = async function (
	startDate,
	endDate,
) {
	const stats = await this.aggregate([
		{
			$match: {
				_destroy: { $ne: true },
				createdAt: { $gte: startDate, $lte: endDate },
			},
		},
		{
			$group: {
				_id: {
					year: { $year: '$createdAt' },
					month: { $month: '$createdAt' },
					day: { $dayOfMonth: '$createdAt' },
				},
				totalChecked: { $sum: 1 },
				appropriateCount: { $sum: { $cond: ['$isAppropriate', 1, 0] } },
				inappropriateCount: {
					$sum: { $cond: ['$isAppropriate', 0, 1] },
				},
				highRiskCount: {
					$sum: { $cond: [{ $eq: ['$riskLevel', 'HIGH'] }, 1, 0] },
				},
			},
		},
		{ $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
	]);

	return stats;
};

const ImageModerationModel = mongoose.model(
	'ImageModeration',
	ImageModerationSchema,
);
export default ImageModerationModel;
