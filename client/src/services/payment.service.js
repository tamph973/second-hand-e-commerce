import axiosConfig from '@/configs/axiosConfig';

const vnpayPayment = async (paymentData) => {
	try {
		const response = await axiosConfig.post('/payments/vnpay', paymentData);
		return response.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const momoPayment = async (paymentData) => {
	try {
		const response = await axiosConfig.post('/payments/momo', paymentData);
		return response.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const handlePaymentForSeller = async (paymentId) => {
	try {
		const response = await axiosConfig.post('/payments/seller', {
			paymentId,
		});
		return response.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getPaymentHistory = async (page, limit) => {
	try {
		const response = await axiosConfig.get('/payments/history', {
			params: { page, limit },
		});
		return response.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};
const PaymentService = {
	vnpayPayment,
	momoPayment,
	handlePaymentForSeller,
	getPaymentHistory,
};

export default PaymentService;
