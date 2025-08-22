import mongoose from 'mongoose';
import slugify from 'slugify';
import ReviewModel from './review.model.js';

const ProductSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			index: true,
		},
		title: { type: String, trim: true, required: true },
		slug: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		description: { type: String, default: '' },
		images: [
			{
				url: { type: String, default: '' },
				public_id: { type: String, default: '' },
			},
		],
		thumbnail: {
			url: { type: String, default: '' },
			public_id: { type: String, default: '' },
		},
		videos: [
			{
				url: { type: String, default: '' },
				thumbnail: { type: String, default: '' },
			},
		],
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
		brandId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Brand',
		},
		// Trạng thái đợi duyệt
		verifyStatus: {
			type: String,
			default: 'PENDING',
			enum: ['PENDING', 'APPROVED', 'REJECTED'],
		},
		// Trạng thái hoạt động
		activeStatus: {
			type: String,
			default: 'ACTIVE',
			enum: ['ACTIVE', 'INACTIVE'],
		},
		price: { type: Number, required: true, min: 0, default: 0 },
		priceRange: {
			min: { type: Number, min: 0 },
			max: { type: Number, min: 0 },
		},
		stock: { type: Number, default: 1 },
		condition: {
			type: String,
			enum: ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'],
			default: 'NEW',
		},
		attributes: {
			type: Object,
			default: {},
		},
		type: {
			type: String,
			enum: ['SINGLE', 'MULTIPLE'],
			default: 'SINGLE',
		},
		address: {
			type: Object,
			default: {},
		},
		sold: {
			type: Number,
			default: 0,
		},
		wishlist: {
			type: Number,
			default: 0,
		},
		reviews: {
			averageRating: { type: Number, default: 0, min: 0, max: 5 },
			totalReviews: { type: Number, default: 0 },
			ratingDistribution: {
				1: { type: Number, default: 0 },
				2: { type: Number, default: 0 },
				3: { type: Number, default: 0 },
				4: { type: Number, default: 0 },
				5: { type: Number, default: 0 },
			},
		},
		_destroy: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

ProductSchema.pre('save', function (next) {
	if (this.isModified('title') && this.title) {
		this.slug = slugify(this.title, {
			lower: true,
			strict: true,
			locale: 'vi',
			trim: true,
		});
	}
	next();
});

// Method để cập nhật review stats
ProductSchema.methods.updateReviewStats = async function () {
	const stats = await ReviewModel.getAverageRating(this._id);

	this.reviews = {
		averageRating: stats.averageRating,
		totalReviews: stats.totalReviews,
		ratingDistribution: stats.ratingDistribution,
	};

	await this.save();
	return this;
};

const ProductModel = mongoose.model('Product', ProductSchema);
export default ProductModel;
