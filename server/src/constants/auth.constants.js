/**
 * Authentication related constants
 */

export const TOKEN_EXPIRY = {
	VERIFY_EMAIL: 600, // 10 minutes
	PASSWORD_RESET: 1800, // 30 minutes
	ACCESS_TOKEN: 3600, // 1 hour
	REFRESH_TOKEN: 604800, // 7 days
};

export const LOGIN_TYPES = {
	NORMAL: 'normal',
	GOOGLE: 'google',
	FACEBOOK: 'facebook',
};

export const USER_STATUS = {
	ACTIVE: 'ACTIVE',
	INACTIVE: 'INACTIVE',
	SUSPENDED: 'SUSPENDED',
};

export const ERROR_MESSAGES = {
	INVALID_CREDENTIALS: 'Thông tin đăng nhập không hợp lệ',
	INVALID_TOKEN: 'Link xác thực không hợp lệ hoặc đã hết hạn',
	USER_NOT_FOUND: 'Người dùng không tồn tại trong hệ thống',
	USER_ID_REQUIRED: 'userId là bắt buộc',
	ACCOUNT_LOCKED:
		'Tài khoản đang bị khóa. Vui lòng liên hệ với quản trị viên',
	EMAIL_NOT_VERIFIED: 'Email chưa được xác thực',
	INVALID_EMAIL: 'Email không hợp lệ',
	INVALID_PASSWORD: 'Mật khẩu phải có ít nhất 8 ký tự',
	EMAIL_EXISTS: 'Email này đã được đăng ký',
	INVALID_PHONE:
		'Số điện thoại không hợp lệ. Vui lòng nhập định dạng 84xxxxxxxxx (9 số sau +84)',
	INVALID_USER_ID: 'userId không hợp lệ hoặc chưa đăng nhập',
	MISSING_FIELDS: 'Vui lòng cung cấp đầy đủ thông tin',
};
