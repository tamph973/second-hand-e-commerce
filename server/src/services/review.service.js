import ReviewModel from '../models/review.model.js';
import ProductModel from '../models/product.model.js';
import Errors from '../common/response/error.response.js';
import { uploadImagesService } from './upload.service.js';

class ReviewService {
	// Tạo review
	async createReview(userId, productId, rating, comment = '', req) {
		if (typeof rating === 'string') {
			rating = Number(rating);
		}

		// Kiểm tra xem user đã review sản phẩm này chưa
		const existingReview = await ReviewModel.findOne({
			userId,
			productId,
			_destroy: false,
		});

		if (existingReview) {
			throw new Errors.BadRequestError(
				'Bạn đã đánh giá sản phẩm này rồi',
			);
		}

		// Xử lý hình ảnh tải lên
		const uploadedImages = await uploadImagesService(req, 'review');

		const reviewData = {
			userId,
			productId,
			rating,
			comment,
		};

		// Thêm ảnh đã upload vào product data
		if (uploadedImages.length > 0) {
			reviewData.images = uploadedImages.map((img) => ({
				url: img.url,
				public_id: img.public_id,
			}));
		}

		// Tạo review
		const review = await ReviewModel.create(reviewData);

		// Cập nhật stats của product
		await this.updateProductReviewStats(productId);

		return review;
	}

	// Lấy reviews của product
	async getProductReviews(productId, options = {}) {
		const reviews = await ReviewModel.getProductReviews(
			productId,
			options,
		).lean();
		const stats = await ReviewModel.getAverageRating(productId);

		const flatReviews = reviews.map((review) => ({
			...review,
			id: review._id,
			userId: review.userId._id,
			fullName: review.userId.fullName,
			avatar: review.userId.avatar.url,
			joinedAt: review.userId.createdAt,
		}));

		return {
			reviews: flatReviews,
			stats,
		};
	}

	// Lấy review của user cho product
	async getUserReview(userId, productId) {
		return await ReviewModel.findOne({
			userId,
			productId,
			_destroy: false,
		}).populate('userId', 'fullName avatar');
	}

	// Cập nhật review
	async updateReview(reviewId, userId, rating, comment = '') {
		const review = await ReviewModel.findOne({
			_id: reviewId,
			userId,
			_destroy: false,
		});

		if (!review) {
			throw new Errors.BadRequestError(
				'Review không tồn tại hoặc không thuộc về bạn',
			);
		}

		review.rating = rating;
		review.comment = comment;
		await review.save();

		// Cập nhật stats
		await this.updateProductReviewStats(review.productId);

		return review;
	}

	// Xóa review
	async deleteReview(reviewId, userId) {
		const review = await ReviewModel.findOne({
			_id: reviewId,
			userId,
			_destroy: false,
		});

		if (!review) {
			throw new Errors.BadRequestError(
				'Review không tồn tại hoặc không thuộc về bạn',
			);
		}

		review._destroy = true;
		await review.save();

		// Cập nhật stats
		await this.updateProductReviewStats(review.productId);

		return { message: 'Đã xóa review thành công' };
	}

	// Cập nhật review stats của product
	async updateProductReviewStats(productId) {
		const product = await ProductModel.findById(productId);
		if (product) {
			await product.updateReviewStats();
		}
	}
}

export default new ReviewService();
