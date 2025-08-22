import {
	userNameFields,
	userEmailFields,
	userMobileFields,
	changePasswordFields,
	addressFields,
} from '../configs/fieldsConfig';

const getFormConfig = (
	user = {},
	provinces = [],
	districts = [],
	wards = [],
	handleProvinceChange,
	handleDistrictChange,
) => ({
	updateName: {
		title: 'Cập nhật tên của bạn',
		textBtn: 'Lưu lại',
		fields: userNameFields,
		initialValues: {
			name: user?.name || '',
		},
	},
	updateEmail: {
		title: 'Cập nhật email',
		textBtn: 'Lưu lại',
		fields: userEmailFields,
		initialValues: {
			email: '',
		},
	},
	updateMobile: {
		title: 'Cập nhật số điện thoại',
		textBtn: 'Lưu lại',
		fields: userMobileFields,
		initialValues: {
			mobile: '',
		},
	},
	addAddress: {
		title: 'Thêm địa chỉ mới',
		textBtn: 'Thêm',
		fields: addressFields(
			provinces,
			districts,
			wards,
			handleProvinceChange,
			handleDistrictChange,
		),
		initialValues: {
			name: '',
			mobile: '',
			province: '',
			district: '',
			ward: '',
			detail: '',
		},
	},
	changePassword: {
		title: 'Đổi mật khẩu',
		textBtn: 'Đổi mật khẩu',
		fields: changePasswordFields,
		initialValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	},
});

export default getFormConfig;
