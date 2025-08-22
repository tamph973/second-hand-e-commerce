import axiosConfig from '@/configs/axiosConfig';

const addToCart = async (data) => {
	try {
		const response = await axiosConfig.post('/carts', data);
		return response;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getCart = async () => {
	const response = await axiosConfig.get('/carts');
	return response.data;
};

const removeCartItem = async (productId, variantId) => {
	try {
		const response = await axiosConfig.delete(`/carts/product`, {
			data: {
				productId,
				variantId,
			},
		});
		return response;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const updateCartItemQuantity = async (data) => {
	try {
		const response = await axiosConfig.put(`/carts`, data);
		return response;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

export const CartService = {
	addToCart,
	getCart,
	removeCartItem,
	updateCartItemQuantity,
};

export default CartService;
