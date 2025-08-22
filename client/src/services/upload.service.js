import axiosConfig from '../configs/axiosConfig';

const uploadAvatar = async (image) => {
	try {
		const formData = new FormData();
		formData.append('avatar', image);
		const res = await axiosConfig.post('/uploads/avatar', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return res.data;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const UploadService = {
	uploadAvatar,
};

export default UploadService;
