import axiosConfig from '@/configs/axiosConfig';

const createDiscount = async (data) => {
	try {
		const response = await axiosConfig.post('/discounts', data);
		return response;
	} catch (error) {
		const message = error.response.data.message;
		return Promise.reject(message);
	}
};

const getAllDiscounts = async () => {
	try {
		const response = await axiosConfig.get('/discounts');
		return response.data;
	} catch (error) {
		const message = error.response.data.message;
		return Promise.reject(message);
	}
};

const getDiscountsForUser = async () => {
	try {
		const response = await axiosConfig.get('/discounts/user');
		return response.data;
	} catch (error) {
		const message = error.response.data.message;
		return Promise.reject(message);
	}
};

const validateDiscountCode = async (code, totalAmount) => {
	try {
		const response = await axiosConfig.post('/discounts/validate', {
			code,
			totalAmount,
		});
		return response.data;
	} catch (error) {
		const message = error.response?.data?.message || error.message;
		return Promise.reject(message);
	}
};

const DiscountService = {
	createDiscount,
	getAllDiscounts,
	getDiscountsForUser,
	validateDiscountCode,
};

export default DiscountService;
