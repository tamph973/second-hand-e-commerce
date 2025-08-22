import axiosConfig from '@/configs/axiosConfig';

const getVariantsByProduct = async (productId) => {
	try {
		const response = await axiosConfig.get(`/variants/${productId}`);
		return response.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const VariantService = {
	getVariantsByProduct,
};

export default VariantService;
