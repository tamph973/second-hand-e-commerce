import axiosConfig from '@/configs/axiosConfig';

const createOrder = async (data) => {
	try {
		const res = await axiosConfig.post('/orders', data);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getAllOrders = async () => {
	try {
		const res = await axiosConfig.get('/orders');
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getOrderDetail = async (orderId) => {
	try {
		const res = await axiosConfig.get(`/orders/${orderId}`);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const updateOrder = async (data) => {
	try {
		const res = await axiosConfig.put('/orders', data);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getSellerOrders = async () => {
	try {
		const res = await axiosConfig.get('/orders/seller');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const updateOrderStatus = async (orderId, status) => {
	try {
		const res = await axiosConfig.put(`/orders/status/${orderId}`, {
			status,
		});
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

export const confirmOrderReceived = async (orderId) => {
	try {
		const res = await axiosConfig.put(
			`/orders/${orderId}/confirm-received`,
		);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const cancelOrder = async (orderId) => {
	try {
		const res = await axiosConfig.put(`/orders/${orderId}/cancel`);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const OrderService = {
	createOrder,
	getAllOrders,
	getOrderDetail,
	updateOrder,
	getSellerOrders,
	updateOrderStatus,
	confirmOrderReceived,
	cancelOrder,
};

export default OrderService;
