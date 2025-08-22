import axios from 'axios';
import { AppURL } from './AppURL';
import {
	getAuthLocalStorage,
	setLocalStorage,
} from '@/utils/localStorageUtils';
import { Navigate } from 'react-router-dom';

// Khởi tạo Axios instance
const axiosConfig = axios.create({
	baseURL: AppURL.BaseURL, //
	withCredentials: true, // Đảm bảo cookie được gửi kèm
	headers: {
		'Content-Type': 'application/json',
	},
});

// Thêm interceptor để tự động gắn token vào request
axiosConfig.interceptors.request.use(
	(config) => {
		// Lấy token mới nhất từ localStorage mỗi lần request
		const { access_token } = getAuthLocalStorage();
		if (access_token) {
			config.headers.Authorization = `Bearer ${access_token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Thêm interceptor để xử lý lỗi 401 và refresh token
axiosConfig.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Nếu lỗi là 401 (Unauthorized) và chưa thử refresh
		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			try {
				// Lấy refresh token mới nhất từ localStorage
				const { refresh_token } = getAuthLocalStorage();

				// Gọi API refresh token
				const res = await axios.post(
					`${AppURL.BaseURL}auth/refresh-token`,
					{},
					{ headers: { Authorization: `Bearer ${refresh_token}` } },
				);


				const newAccessToken = res.data.data.access_token;
				setLocalStorage('access_token', newAccessToken);

				if (newAccessToken) {
					// // Cập nhật token cho request gốc và thử lại
					// originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return axios({
						...originalRequest,
						headers: {
							...originalRequest.headers,
							Authorization: `Bearer ${newAccessToken}`,
						},
					});
				}
			} catch (error) {
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	},
);

export default axiosConfig;
