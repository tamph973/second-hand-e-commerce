import axiosConfig from '@/configs/axiosConfig';

const getUserAddress = async () => {
	try {
		const res = await axiosConfig.get('/address');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const createAddress = async (data) => {
	try {
		const res = await axiosConfig.post('/address', data);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const updateAddress = async (id, data) => {
	try {
		const res = await axiosConfig.put(`/address/${id}`, data);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const deleteAddress = async (id) => {
	try {
		const res = await axiosConfig.delete(`/address/${id}`);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getProvincesInProduct = async () => {
	try {
		const res = await axiosConfig.get('/address/provinces-in-products');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const AddressService = {
	getUserAddress,
	createAddress,
	updateAddress,
	deleteAddress,
	getProvincesInProduct,
};
export default AddressService;
