import axiosConfig from '@/configs/axiosConfig';

const createSubCategory = async (data) => {
	try {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('image', data.image);
		formData.append('categoryId', data.categoryId);
		const res = await axiosConfig.post('/subcategories', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getAllSubCategories = async () => {
	try {
		const res = await axiosConfig.get('/subcategories');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getSubCategoryById = async (id) => {
	const res = await axiosConfig.get(`/subcategories/${id}`);
	return res;
};

const updateSubCategory = async (id, data) => {
	const res = await axiosConfig.put(`/subcategories/${id}`, data, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	return res;
};

const deleteSubCategory = async (id) => {
	const res = await axiosConfig.delete(`/subcategories/${id}`);
	return res;
};

const SubCategoryService = {
	createSubCategory,
	getAllSubCategories,
	getSubCategoryById,
	updateSubCategory,
	deleteSubCategory,
};

export default SubCategoryService;
