import axiosConfig from '@/configs/axiosConfig';

const createReview = async (data) => {
	try {
		const formData = new FormData();
		formData.append('productId', data.productId);
		formData.append('rating', data.rating);
		formData.append('comment', data.comment);
		data.images.forEach((image) => {
			formData.append('images', image);
		});
		const response = await axiosConfig.post('/reviews', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getProductReviews = async (productId) => {
	try {
		const response = await axiosConfig.get(`/reviews/product/${productId}`);
		return response.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const ReviewService = {
	createReview,
	getProductReviews,
};

export default ReviewService;
