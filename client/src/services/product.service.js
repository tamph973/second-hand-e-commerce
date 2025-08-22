import axiosConfig from '@/configs/axiosConfig';
import axios from 'axios';

const getAllProducts = async (reqQuery) => {
	try {
		const res = await axiosConfig.get(`/products`, { params: reqQuery });
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getProductsByCategory = async (categoryId) => {
	try {
		const res = await axiosConfig.get(`/products/category/${categoryId}`);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getProductsGroupedByCategory = async () => {
	try {
		const res = await axiosConfig.get('/products/group-category');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getProductById = async (productId) => {
	try {
		const res = await axiosConfig.get(`/products/${productId}`);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getProductsBySeller = async (sellerId, params) => {
	try {
		const res = await axiosConfig.get(`/products/seller/${sellerId}`, {
			params,
		});
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

// Lấy sản phẩm theo slug danh mục
export const getProductsByCategorySlug = async (categorySlug, options = {}) => {
	try {
		const {
			page = 1,
			limit = 12,
			sortBy,
			minPrice,
			maxPrice,
			condition,
			capacity,
			color,
			// Filter địa chỉ
			province,
			provinceCode,
			districtCode,
			wardCode,
			provinceName,
			districtName,
			wardName,
			search,
		} = options;

		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(sortBy && { sortBy }),
			...(minPrice && { minPrice }),
			...(maxPrice && { maxPrice }),
			...(condition && { condition }),
			...(capacity && { capacity }),
			...(color && { color }),
			// Filter địa chỉ
			...(province && { province }),
			...(provinceCode && { provinceCode }),
			...(districtCode && { districtCode }),
			...(wardCode && { wardCode }),
			...(provinceName && { provinceName }),
			...(districtName && { districtName }),
			...(wardName && { wardName }),
			...(search && { search }),
		});

		const response = await axiosConfig.get(
			`/products/category/${categorySlug}?${params}`,
		);
		return response.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

export const searchProducts = async (options = {}) => {
	try {
		const res = await axiosConfig.get(`/products/search`, {
			params: options,
		});
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

export const getProductRecommend = async (productId) => {
	try {
		const res = await axios.get(
			`http://localhost:5000/recommend/${productId}`,
		);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

// Lấy thống kê sản phẩm
const getProductStats = async () => {
	try {
		const res = await axiosConfig.get('/products/stats');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const updateProductVerifyStatus = async (productId, status) => {
	try {
		const res = await axiosConfig.put('/products/verify', {
			productId,
			status,
		});
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const updateProductStatus = async (productId, status) => {
	try {
		const res = await axiosConfig.put('/products/active', {
			productId,
			status,
		});
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const ProductService = {
	getAllProducts,
	getProductsByCategory,
	getProductsGroupedByCategory,
	getProductById,
	getProductsBySeller,
	getProductsByCategorySlug,
	searchProducts,
	getProductRecommend,
	getProductStats,
	updateProductVerifyStatus,
	updateProductStatus,
};

export default ProductService;
