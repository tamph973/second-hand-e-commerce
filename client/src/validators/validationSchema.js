import * as yup from 'yup';

export const changePasswordSchema = yup.object({
	currentPassword: yup
		.string()
		.required('Mật khẩu hiện tại không được để trống'),
	newPassword: yup
		.string()
		.min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
		.matches(/[a-zA-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ cái')
		.matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số')
		.matches(
			/[!@#$%^&*()_+[\]{}|;:'",.<>?/\\]/,
			'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
		)
		.required('Mật khẩu mới không được để trống'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
		.required('Xác nhận mật khẩu không được để trống'),
});

export const loginSchema = yup.object({
	email: yup.string().required('Email không được để trống'),
	password: yup.string().required('Mật khẩu không được để trống'),
});

export const addressSchema = yup.object({
	fullName: yup.string().trim().required('Họ và tên không được để trống'),
	phoneNumber: yup
		.string()
		.matches(
			/^0\d{9}$/,
			'Số điện thoại không hợp lệ (phải có 10 chữ số và bắt đầu bằng 0)',
		)
		.required('Số điện thoại không được để trống'),
	provinceCode: yup.string().required('Vui lòng chọn Tỉnh/Thành phố'),
	wardCode: yup.string().required('Vui lòng chọn Xã/Phường'),
	addressDetail: yup.string().trim(),
});

export const registerSchema = yup.object({
	fullName: yup.string().required('Họ và tên không được để trống'),
	email: yup
		.string()
		.email('Email không hợp lệ')
		.required('Email không được để trống'),
	password: yup
		.string()
		.min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
		.matches(/[a-zA-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ cái')
		.matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số')
		.matches(
			/[!@#$%^&*()_+[\]{}|;:'",.<>?/\\]/,
			'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
		)
		.required('Mật khẩu không được để trống'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
		.required('Xác nhận lại mật khẩu'),
});
