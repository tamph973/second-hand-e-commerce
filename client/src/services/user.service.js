import axiosConfig from '../configs/axiosConfig';

const getUserData = async () => {
	try {
		const res = await axiosConfig.get('/users');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const updateUser = async (data) => {
	try {
		const res = await axiosConfig.put('/users', data);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const changePassword = async (data) => {
	try {
		const res = await axiosConfig.put('/users/change-password', data);
		if (res.data) {
			localStorage.clear();
		}
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getAllUser = async () => { 
	try {
		const res = await axiosConfig.get('/users/all');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
}

const UserService = { getUserData, changePassword, updateUser, getAllUser };
export default UserService;
