import axiosConfig from '@/configs/axiosConfig';

const createBrand = async (data) => {
	try {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('image', data.image[0]);
		const res = await axiosConfig.post('/brands', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getAllBrands = async () => {
	try {
		const res = await axiosConfig.get('/brands');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const deleteBrand = async (id) => {
	try {
		const res = await axiosConfig.delete(`/brands/${id}`);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};
const BrandService = {
	createBrand,
	getAllBrands,
	deleteBrand,
};

export default BrandService;
