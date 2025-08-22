import axiosConfig from '@/configs/axiosConfig';
import axios from 'axios';
import {
	clearLocalStorage,
	removeAuthLocalStorage,
	setAuthLocalStorage,
	clearHistory,
} from '@/utils/localStorageUtils';

const register = async (data) => {
	try {
		const res = await axiosConfig.post('/auth/register', data);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const login = async (data) => {
	try {
		const res = await axiosConfig.post('/auth/login', data);
		setAuthLocalStorage({
			userId: res.data.data.id,
			access_token: res.data.data.access_token,
			refresh_token: res.data.data.refresh_token,
		});
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const logout = async () => {
	try {
		const res = await axiosConfig.post('/auth/logout');
		if (res.data) {
			removeAuthLocalStorage();
		}
		clearHistory();
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getUserInfoGoogle = async (token) => {
	const res = await axios.get(
		'https://www.googleapis.com/oauth2/v3/userinfo',
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return res.data;
};

const getUserInfoFacebook = async (token) => {
	const res = await axios.get(
		'https://graph.facebook.com/me?fields=id,name,email,picture',
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return res.data;
};

const authSocial = async (data) => {
	try {
		const res = await axiosConfig.post('/auth/auth-social', data);
		setAuthLocalStorage({
			userId: res.data.data.id,
			access_token: res.data.data.access_token,
			refresh_token: res.data.data.refresh_token,
		});
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const authGoogle = async () => {
	try {
		const res = await axiosConfig.get('/auth/google');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};
const forgotPassword = async (data) => {
	try {
		const res = await axiosConfig.put('/auth/forgot-password', data);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const verifyOTP = async (data) => {
	try {
		const res = await axiosConfig.put('/auth/verify-otp', data);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const resetPassword = async (data) => {
	try {
		const res = await axiosConfig.put('/auth/reset-password', data);
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getAuthUser = async () => {
	try {
		const res = await axiosConfig.get('/auth/user');
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const changeEmail = async (data) => {
	try {
		const res = await axiosConfig.put('/auth/change-email', data);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const verifyChangeEmail = async (data) => {
	try {
		const res = await axiosConfig.put('/auth/verify-change-email', data);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const sendPhoneOTP = async (data) => {
	try {
		const res = await axiosConfig.post('/auth/send-sms', data);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const verifyPhoneOTP = async (data) => {
	try {
		const res = await axiosConfig.put('/auth/verify-phone-otp', data);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const changePassword = async (data) => {
	try {
		const res = await axiosConfig.put('/auth/change-password', data);
		if (res.data) {
			clearLocalStorage();
		}
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const AuthService = {
	register,
	login,
	logout,
	authSocial,
	forgotPassword,
	verifyOTP,
	resetPassword,
	getUserInfoGoogle,
	getUserInfoFacebook,
	getAuthUser,
	authGoogle,
	changeEmail,
	verifyChangeEmail,
	sendPhoneOTP,
	verifyPhoneOTP,
	changePassword,
};
export default AuthService;
