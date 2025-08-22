import sendEmail from '../configs/sendEmail.js';
import UserModel from '../models/user.model.js';
import convertDate from '../utils/convertDate.js';
import {
	generateOTP,
	generateRandomPassword,
	toPhoneE164,
} from '../utils/helpers.js';
import JWTService from '../services/jwt.service.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../configs/environment.js';
import redisClient from '../configs/redisConfig.js';
import Errors from '../common/response/error.response.js';
import axios from 'axios';
import {
	TOKEN_EXPIRY,
	LOGIN_TYPES,
	USER_STATUS,
	ERROR_MESSAGES,
} from '../constants/auth.constants.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { changePasswordTemplate } from '../templates/index.js';
import sendSMS from '../configs/sendSMS.js';

class AuthService {
	async register({ fullName, email, password }) {
		const { error } = registerSchema.validate({
			fullName,
			email,
			password,
		});
		if (error) throw new Errors.BadRequestError(error.details[0].message);

		// Check email is exist
		const existingUser = await UserModel.findOne({ email });

		if (existingUser && existingUser?.isEmailVerified) {
			throw new Errors.BadRequestError(ERROR_MESSAGES.EMAIL_EXISTS);
		}

		// Create new user
		const user = await UserModel.create({
			email,
			password,
			fullName,
			typeLogin: [LOGIN_TYPES.NORMAL],
		});

		// Generate verification token
		const verificationToken = crypto.randomBytes(32).toString('hex');
		await redisClient.set(
			`VERIFY_EMAIL_${email}`,
			verificationToken,
			'EX',
			TOKEN_EXPIRY.VERIFY_EMAIL,
		);

		// Send verification email
		const verifyEmailURL = `${env.SERVER_URL}/api/v1/auth/verify-email?token=${verificationToken}&email=${user.email}`;
		await sendEmail({
			to: email,
			subject: 'Xác nhận địa chỉ email E-Technology',
			html: verifyEmailTemplate({
				name: user.fullName,
				url: verifyEmailURL,
			}),
		});

		return { user: user._id };
	}

	async login({ email, password }) {
		const { error } = loginSchema.validate({
			email,
			password,
		});
		if (error) throw new Errors.BadRequestError(error.details[0].message);

		const user = await UserModel.findOne({ email }).select('+password');

		if (!user) {
			throw new Errors.NotFoundError(ERROR_MESSAGES.INVALID_CREDENTIALS);
		}

		// Check account status
		if (user.status !== USER_STATUS.ACTIVE) {
			throw new Errors.ForbiddenError(ERROR_MESSAGES.ACCOUNT_LOCKED);
		}

		// Check email verification
		if (!user.isEmailVerified) {
			throw new Errors.ForbiddenError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
		}

		// Check if password exists
		if (!user.password) {
			throw new Errors.BadRequestError(
				'Tài khoản chưa được thiết lập mật khẩu',
			);
		}

		// Verify password
		const isMatch = await user.isPasswordMatched(password);
		if (!isMatch) {
			throw new Errors.BadRequestError(
				ERROR_MESSAGES.INVALID_CREDENTIALS,
			);
		}

		// Check if password has expired (for social login users)
		if (
			user.passwordExpires &&
			Date.now() > new Date(user.passwordExpires).getTime()
		) {
			throw new Errors.ForbiddenError(
				'Mật khẩu đã hết hạn. Vui lòng sử dụng chức năng quên mật khẩu để đặt lại mật khẩu mới.',
			);
		}

		// Generate tokens
		const [accessToken, refreshToken] = await Promise.all([
			JWTService.generateAccessToken(user._id, user.role),
			JWTService.generateRefreshToken(user._id, user.role),
		]);

		// Update user data
		await Promise.all([
			UserModel.updateOne(
				{ email },
				{
					typeLogin: [LOGIN_TYPES.NORMAL],
					passwordExpires: null, // Clear password expiration after successful login
				},
			),
			user.updateLastLogin(),
		]);

		return {
			id: user._id,
			access_token: accessToken,
			refresh_token: refreshToken,
		};
	}

	async logout({ id, exp, jit }) {
		// Input validation
		if (!id) {
			throw new Errors.BadRequestError(ERROR_MESSAGES.INVALID_USER_ID);
		}

		// Find user and handle errors
		const user = await UserModel.findById(id).select('+refresh_token');
		if (!user) {
			throw new Errors.NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
		}

		const now = Math.floor(Date.now() / 1000);
		const ttl = exp ? Math.max(exp - now, 0) : 3600;
		const tokenKey = `TOKEN_BLACK_LIST_${id}_${jit || now}`;

		await Promise.all([
			UserModel.findByIdAndUpdate(id, { refresh_token: '' }),
			redisClient.set(tokenKey, 1, 'EX', ttl),
		]);

		return { success: true };
	}

	async verifyEmail({ token, email }) {
		const storedToken = await redisClient.get(`VERIFY_EMAIL_${email}`);
		if (!storedToken || storedToken !== token) {
			throw new Errors.BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
		}

		const user = await UserModel.findOne({ email });
		if (!user) {
			throw new Errors.NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
		}

		// Update user verification status and remove token in parallel
		await Promise.all([
			UserModel.updateOne({ email }, { isEmailVerified: true }),
			redisClient.del(`VERIFY_EMAIL_${email}`),
		]);
		return { success: true };
	}

	async refreshToken(token, id) {
		const existingUser = await UserModel.findById(id).select(
			'+refresh_token',
		);

		if (!token) {
			throw new Errors.BadRequestError('Vui lòng cung cấp refresh token');
		}

		if (!existingUser) {
			throw new Errors.BadRequestError(
				'Người dùng không tồn tại trong hệ thống',
			);
		}

		if (existingUser.refresh_token !== token) {
			throw new Errors.BadRequestError('Refresh token không hợp lệ');
		}

		const newAccessToken = await JWTService.refreshTokenService(token);

		return {
			access_token: newAccessToken,
		};
	}

	async forgotPassword({ email }) {
		const user = await UserModel.findOne({ email });
		if (!user) {
			throw new Errors.NotFoundError('Vui lòng kiểm tra lại email	');
		}

		const otp = generateOTP();
		const expireTime = Date.now() + 1000 * 60 * 30;

		await UserModel.findByIdAndUpdate(user._id, {
			resetPasswordOTP: otp,
			resetPasswordExpires: new Date(expireTime).toISOString(),
		});

		const data = {
			to: email,
			subject: `${otp} là mã xác nhận yêu cầu đặt lại mật khẩu tài khoản của bạn`,
			text: 'Xin chào',
			html: forgotPasswordTemplate({ name: user.fullName, otpCode: otp }),
		};
		sendEmail(data);
		return true;
	}

	async changeEmail(id, newEmail) {
		const user = await UserModel.findById(id);
		if (!user) {
			throw new Errors.NotFoundError('Không tìm thấy người dùng');
		}

		if (user.email === newEmail) {
			throw new Errors.BadRequestError(
				'Email mới trùng với email hiện tại',
			);
		}

		// Generate OTP and set expiry
		const otp = generateOTP();
		const expireTime = Date.now() + 1000 * 60 * 30; // 30 minutes

		await UserModel.findByIdAndUpdate(user._id, {
			emailChangeOTP: otp,
			emailChangeExpires: new Date(expireTime).toISOString(),
		});

		const data = {
			to: newEmail,
			subject: 'Xác nhận yêu cầu thay đổi email của bạn',
			text: 'Xin chào',
			html: verifyChangeEmailTemplate({
				name: user.fullName,
				otpCode: otp,
			}),
		};

		await sendEmail(data);
		return true;
	}

	async changePassword(id, data) {
		const { currentPassword, newPassword, confirmPassword } = data;
		const user = await UserModel.findById(id).select('+password');
		if (!user) {
			throw new Errors.NotFoundError('Không tìm thấy người dùng');
		}

		const isMatch = await user.isPasswordMatched(currentPassword);
		if (!isMatch) {
			throw new Errors.BadRequestError('Mật khẩu hiện tại không đúng');
		}

		if (newPassword !== confirmPassword) {
			throw new Errors.BadRequestError('Mật khẩu không khớp');
		}

		await user.changePassword(newPassword);

		const currentTime = new Date().toISOString();
		const timeConvert = convertDate(currentTime);

		const mailData = {
			to: user.email,
			subject: `Mật khẩu đã được thay đổi vào lúc ${timeConvert}`,
			text: 'Xin chào',
			html: changePasswordTemplate({ time: timeConvert }),
		};

		// sendEmail(mailData);
		return true;
	}

	async verifyOTP({ email, otp }) {
		if (!email || !otp) {
			throw new Errors.BadRequestError(
				'Vui lòng cung cấp email và mã OTP',
			);
		}

		const user = await UserModel.findOne({ email }).select(
			'+resetPasswordOTP',
		);

		if (!user) {
			throw new Errors.NotFoundError(
				'Người dùng không tồn tại trong hệ thống',
			);
		}
		const now = Date.now();
		const otpExpired = new Date(user.resetPasswordExpires).getTime();
		if (now > otpExpired || user.resetPasswordOTP !== otp.trim()) {
			throw new Errors.BadRequestError(
				'Mã xác nhận không đúng hoặc đã hết hạn',
			);
		}

		await user.clearPasswordResetOTP();
	}

	async verifyChangeEmail({ currentEmail, newEmail, otp }) {
		if (!currentEmail || !newEmail || !otp) {
			throw new Errors.BadRequestError(
				'Vui lòng cung cấp đầy đủ thông tin email cũ, email mới và mã OTP',
			);
		}

		// Check if new email already exists
		const existingUser = await UserModel.findOne({ email: newEmail });
		if (existingUser) {
			throw new Errors.BadRequestError(
				'Email mới đã được sử dụng bởi tài khoản khác',
			);
		}

		// Get user and validate OTP
		const user = await UserModel.findOne({ email: currentEmail }).select(
			'+emailChangeOTP',
		);
		if (!user) {
			throw new Errors.NotFoundError('Không tìm thấy người dùng');
		}
		const now = Date.now();
		const otpExpired = new Date(user.emailChangeExpires).getTime();
		if (now > otpExpired || user.emailChangeOTP !== otp.trim()) {
			throw new Errors.BadRequestError(
				'Mã xác nhận không đúng hoặc đã hết hạn',
			);
		}

		await user.clearEmailChangeOTP();
		await UserModel.findByIdAndUpdate(user._id, { email: newEmail });
		return true;
	}

	async resetPassword(data) {
		const { email, newPassword, confirmPassword } = data;
		const user = await UserModel.findOne({ email });

		if (!newPassword || !confirmPassword) {
			throw new Errors.BadRequestError(
				'Vui lòng cung cấp đầy đủ thông tin',
			);
		}

		if (!user) {
			throw new Errors.NotFoundError(
				'Người dùng không tồn tại trong hệ thống',
			);
		}

		if (newPassword !== confirmPassword) {
			throw new Error('Mật khẩu mới và xác nhận mật khẩu không khớp');
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		await UserModel.findByIdAndUpdate(
			user._id,
			{
				password: hashedPassword,
			},
			{ new: true },
		);

		const currentTime = new Date().toISOString();
		const timeConvert = convertDate(currentTime);

		const mailData = {
			to: user.email,
			subject: `Mật khẩu đã được thay đổi vào lúc ${timeConvert}`,
			text: 'Xin chào',
			html: changePasswordTemplate({ time: timeConvert }),
		};

		sendEmail(mailData);
	}

	async authSocial(data) {
		const { fullName, email, avatar, type_login } = data;
		if (type_login !== 'google' && type_login !== 'facebook') {
			throw new Errors.BadRequestError('Type login không hợp lệ');
		}

		let user = await UserModel.findOne({ email }).select(
			'+refresh_token +password',
		);
		let isNewUser = false;
		let defaultPassword = null;

		if (user) {
			const typeLoginList = Array.isArray(user.typeLogin)
				? [...user.typeLogin]
				: [];

			if (!typeLoginList.includes(type_login)) {
				typeLoginList.push(type_login);
			}

			const newData = {
				fullName: user.fullName || fullName,
				avatar: {
					url: user.avatar.url || avatar,
					public_id: user.avatar.public_id || '',
				},
				gender: user.gender || 'OTHER',
				typeLogin: typeLoginList,
				isEmailVerified: true,
			};

			await UserModel.findByIdAndUpdate(user._id, newData, { new: true });
		} else {
			isNewUser = true;
			defaultPassword = generateRandomPassword();
			user = new UserModel({
				email,
				fullName,
				password: defaultPassword,
				avatar: { url: avatar, public_id: '' },
				gender: 'OTHER',
				typeLogin: [type_login],
				isEmailVerified: true,
				passwordExpires: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
			});

			await user.save();

			// Send default password email
			if (defaultPassword) {
				await sendEmail({
					to: email,
					subject: 'Mật khẩu mặc định cho tài khoản của bạn',
					html: defaultPasswordTemplate({
						name: fullName,
						password: defaultPassword,
					}),
				});
			}
		}

		// Generate tokens
		const [accessToken, refreshToken] = await Promise.all([
			JWTService.generateAccessToken(user._id, user.role),
			JWTService.generateRefreshToken(user._id, user.role),
		]);
		await user.updateLastLogin();
		return {
			id: user._id,
			fullName: user.fullName,
			email: user.email,
			email_verified: user.isEmailVerified,
			avatar: user.avatar,
			role: user.role,
			gender: user.gender,
			lastLogin: user.lastLogin,
			createdAt: user.createdAt,
			typeLogin: user.typeLogin,
			access_token: accessToken,
			refresh_token: refreshToken,
			isNewUser,
			defaultPassword, // Only returned for new users
		};
	}

	// Generate JWT for Stringee API
	generateStringeeToken() {
		const payload = {
			jti: `${env.STRINGEE_API_KEY_SID}_${Date.now()}`,
			iss: env.STRINGEE_API_KEY_SID,
			exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY.ACCESS_TOKEN,
			rest_api: true,
		};

		const token = jwt.sign(payload, env.STRINGEE_API_KEY_SECRET, {
			algorithm: 'HS256',
			header: { cty: 'stringee-api;v=1' },
		});
		return token;
	}

	// Call Stringee API
	async callStringee(token, phoneNumber, otp) {
		const raw = JSON.stringify({
			from: {
				type: 'external',
				number: '842471016160',
				alias: 'STRINGEE_NUMBER',
			},
			to: [
				{
					type: 'external',
					number: phoneNumber,
					alias: 'TO_NUMBER',
				},
			],
			answer_url: 'https://example.com/answerurl',
			actions: [
				{
					action: 'talk',
					text: `Mã OTP của bạn là ${otp}`,
				},
			],
		});

		try {
			const response = await axios.post(
				'https://api.stringee.com/v1/call2/callout',
				raw,
				{
					headers: {
						'X-STRINGEE-AUTH': token,
						'Content-Type': 'application/json',
					},
				},
			);

			return response;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// Send OTP to phone number
	async sendPhoneOTP(userId, phoneNumber) {
		const otp = generateOTP();
		const expireTime = Date.now() + 1000 * 60 * 5; // 5 minutes

		// Generate JWT for Stringee API
		const token = this.generateStringeeToken();

		// Call Stringee API
		await this.callStringee(token, phoneNumber, otp);

		await UserModel.findByIdAndUpdate(userId, {
			phoneChangeOTP: otp,
			phoneChangeExpires: new Date(expireTime).toISOString(),
		});

		return true;
	}

	async sendSMS(userId, phoneNumber) {
		const otp = generateOTP();
		const expireTime = Date.now() + 1000 * 60 * 5; // 5 minutes

		const user = await UserModel.findById(userId);
		if (!user) {
			throw new Errors.NotFoundError('Người dùng không tồn tại');
		}

		// Check if phone number is already in use
		// const existingUser = await UserModel.findOne({ phoneNumber });
		// if (existingUser) {
		// 	throw new Errors.BadRequestError('Số điện thoại đã được sử dụng');
		// }
		const phoneNumberE164 = toPhoneE164(phoneNumber); // example: 0977490021 -> +84977490021
		await UserModel.findByIdAndUpdate(userId, {
			phoneChangeOTP: otp,
			phoneChangeExpires: new Date(expireTime).toISOString(),
		});
		const message = await sendSMS(phoneNumberE164, otp);
		return message;
	}

	async verifyPhoneOTP(userId, phoneNumber, otp) {
		if (!otp) {
			throw new Errors.BadRequestError('Vui lòng cung cấp mã OTP');
		}

		const user = await UserModel.findOne({ _id: userId }).select(
			'+phoneChangeOTP +phoneChangeExpires',
		);
		if (!user) {
			throw new Errors.NotFoundError('Người dùng không tồn tại');
		}

		const now = Date.now();
		const otpExpired = new Date(user.phoneChangeExpires).getTime();
		if (
			now > otpExpired ||
			String(user.phoneChangeOTP).trim() !== String(otp).trim()
		) {
			throw new Errors.BadRequestError(
				'Mã xác nhận không đúng hoặc đã hết hạn',
			);
		}

		// Cập nhật xác thực và xóa OTP
		user.phoneNumber = phoneNumber;
		user.isPhoneVerified = true;
		user.phoneChangeOTP = null;
		user.phoneChangeExpires = null;
		await user.save();

		return true;
	}

	async getAuthUser(id) {
		if (!id) {
			throw new Errors.BadRequestError(ERROR_MESSAGES.INVALID_USER_ID);
		}

		const user = await UserModel.findById(id).populate('address');
		if (!user) {
			throw new Errors.NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
		}
		return user;
	}
}

export default new AuthService();
