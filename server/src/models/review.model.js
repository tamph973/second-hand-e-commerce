import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		images: [
			{
				url: { type: String, default: '' },
				public_id: { type: String, default: '' },
			},
		],
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

// Index để tối ưu query
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Static method để lấy reviews của product
ReviewSchema.statics.getProductReviews = function (productId, options = {}) {
	const { page = 1, limit = 5 } = options;

	return this.find({
		productId,
		_destroy: false,
	})
		.populate('userId', 'fullName avatar createdAt')
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit);
};

// Static method để tính rating trung bình của product
ReviewSchema.statics.getAverageRating = async function (productId) {
	const result = await this.aggregate([
		{
			$match: {
				productId: new mongoose.Types.ObjectId(productId),
				_destroy: false,
			},
		},
		{
			$group: {
				_id: null,
				averageRating: { $avg: '$rating' },
				totalReviews: { $sum: 1 },
				ratingDistribution: {
					$push: '$rating',
				},
			},
		},
	]);

	if (result.length === 0) {
		return {
			averageRating: 0,
			totalReviews: 0,
			ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
		};
	}

	const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
	result[0].ratingDistribution.forEach((rating) => {
		ratingDistribution[rating]++;
	});

	return {
		averageRating: Math.round(result[0].averageRating * 10) / 10,
		totalReviews: result[0].totalReviews,
		ratingDistribution,
	};
};

const ReviewModel = mongoose.model('Review', ReviewSchema);
export default ReviewModel;
