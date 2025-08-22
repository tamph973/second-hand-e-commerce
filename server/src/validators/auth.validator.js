import Joi from 'joi';
import { REGEX, VALIDATION } from '../constants/validation.constants.js';

export const registerSchema = Joi.object({
	fullName: Joi.string()
		.pattern(REGEX.NAME)
		.min(VALIDATION.NAME_MIN_LENGTH)
		.max(VALIDATION.NAME_MAX_LENGTH)
		.required()
		.messages({
			'string.pattern.base': 'Tên chỉ được chứa chữ cái và khoảng trắng',
			'string.min': 'Tên phải có ít nhất {#limit} ký tự',
			'string.max': 'Tên không được vượt quá {#limit} ký tự',
			'any.required': 'Vui lòng nhập tên',
		}),
	email: Joi.string()
		.trim()
		.pattern(REGEX.EMAIL)
		.required()
		.empty('')
		.messages({
			'string.pattern.base': 'Email không hợp lệ',
			'any.required': 'Email không được bỏ trống',
			'string.empty': 'Email không được bỏ trống',
			'string.base': 'Email phải là chuỗi ký tự',
		}),
	password: Joi.string()
		.trim()
		.pattern(REGEX.PASSWORD)
		.min(VALIDATION.PASSWORD_MIN_LENGTH)
		.required()
		.empty('')
		.messages({
			'string.pattern.base':
				'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
			'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
			'any.required': 'Mật khẩu không được bỏ trống',
			'string.empty': 'Mật khẩu không được bỏ trống',
			'string.base': 'Mật khẩu phải là chuỗi ký tự',
		}),
});

export const loginSchema = Joi.object({
	email: Joi.string()
		.trim()
		.pattern(REGEX.EMAIL)
		.required()
		.empty('')
		.messages({
			'string.pattern.base': 'Thông tin đăng nhập chưa chính xác',
			'any.required': 'Email không được bỏ trống',
			'string.empty': 'Email không được bỏ trống',
			'string.base': 'Thông tin đăng nhập chưa chính xác',
		}),
	password: Joi.string().trim().required().empty('').messages({
		'any.required': 'Mật khẩu không được bỏ trống',
		'string.empty': 'Mật khẩu không được bỏ trống',
		'string.base': 'Thông tin đăng nhập chưa chính xác',
	}),
});
