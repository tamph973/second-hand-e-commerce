import axiosConfig from '@/configs/axiosConfig';

const createCategory = async (categoryData) => {
	try {
		const formData = new FormData();
		formData.append('name', categoryData.name);
		formData.append('parentId', categoryData.parentId);
		formData.append('image', categoryData.image[0]);
		const res = await axiosConfig.post('/categories', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});

		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getAllCategory = async (params) => {
	try {
		const res = await axiosConfig.get(`/categories`, { params });
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getCategoryChildren = async (parentId, params) => {
	try {
		const res = await axiosConfig.get(`/categories/children/${parentId}`, {
			params,
		});
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};
const getCategoryTree = async () => {
	try {
		const res = await axiosConfig.get('/categories/tree');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};
const updateCategory = async (id, updateData) => {
	try {
		const formData = new FormData();
		formData.append('name', updateData.name);
		formData.append('image', updateData.image[0]);
		const res = await axiosConfig.put(`/categories/${id}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getCategoryById = async (id) => {
	try {
		const res = await axiosConfig.get(`/categories/${id}`);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getCategoryByShop = async (shopId) => {
	try {
		const res = await axiosConfig.get(`/categories/shop/${shopId}`);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getSubCategories = async () => {
	try {
		const res = await axiosConfig.get('/categories/sub');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const updateCategoryStatus = async (id, status) => {
	try {
		const res = await axiosConfig.put(`/categories/status/${id}`, { status });
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const CategoryService = {
	getAllCategory,
	getCategoryChildren,
	getCategoryTree,
	createCategory,
	updateCategory,
	getCategoryById,
	getCategoryByShop,
	getSubCategories,
	updateCategoryStatus,
};
export default CategoryService;
