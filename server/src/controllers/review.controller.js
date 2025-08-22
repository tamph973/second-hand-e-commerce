import ReviewService from '../services/review.service.js';
import Success from '../common/response/success.response.js';

// Tạo review
export const createReview = async (req, res, next) => {
	try {
		const { productId, rating, comment } = req.body;
		const userId = req.user.id;

		const review = await ReviewService.createReview(
			userId,
			productId,
			rating,
			comment,
			req,
		);

		return new Success.Created({
			message: 'Tạo review thành công',
			data: review,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Lấy reviews của product
export const getProductReviews = async (req, res) => {
	const { productId } = req.params;
	const { page, limit } = req.query;

	const result = await ReviewService.getProductReviews(productId, {
		page: parseInt(page),
		limit: parseInt(limit),
	});

	return new Success.Ok({
		message: 'Lấy reviews của product thành công',
		data: result,
	}).send(res);
};

// Lấy review của user cho product
export const getUserReview = async (req, res) => {
	const { productId } = req.params;
	const userId = req.user._id;

	const review = await ReviewService.getUserReview(userId, productId);

	return new Success.Ok({
		message: 'Lấy review của user cho product thành công',
		data: review,
	}).send(res);
};

// Cập nhật review
export const updateReview = async (req, res) => {
	const { reviewId } = req.params;
	const { rating, comment } = req.body;
	const userId = req.user._id;

	const review = await ReviewService.updateReview(
		reviewId,
		userId,
		rating,
		comment,
	);

	return new Success.Ok({
		message: 'Cập nhật review thành công',
		data: review,
	}).send(res);
};

// Xóa review
export const deleteReview = async (req, res) => {
	const { reviewId } = req.params;
	const userId = req.user._id;

	const result = await ReviewService.deleteReview(reviewId, userId);

	return new Success.Ok({
		message: result.message,
	}).send(res);
};
