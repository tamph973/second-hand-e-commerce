import axiosConfig from '@/configs/axiosConfig';

const addToWishlist = async (productId) => {
	try {
		const res = await axiosConfig.post('/wishlists', { productId });
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const checkWishlistStatus = async (productId) => {
	try {
		const res = await axiosConfig.get(`/wishlists/check/${productId}`);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getWishlist = async () => {
	try {
		const res = await axiosConfig.get('/wishlists');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const clearWishlist = async () => {
	try {
		const res = await axiosConfig.delete('/wishlists');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getWishlistCount = async () => {
	try {
		const res = await axiosConfig.get('/wishlists/count');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};
const WishlistService = {
	addToWishlist,
	checkWishlistStatus,
	getWishlist,
	clearWishlist,
	getWishlistCount,
};

export default WishlistService;
