import AuthService from '../services/auth.service.js';
import Success from '../common/response/success.response.js';
import { env } from '../configs/environment.js';
import { ERROR_MESSAGES } from '../constants/auth.constants.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	env.GOOGLE_REDIRECT_URI,
);

export async function authGoogle(req, res, next) {
	const url = client.generateAuthUrl({
		access_type: 'offline',
		scope: ['email', 'profile'],
	});

	res.redirect(url);
}
export async function register(req, res, next) {
	try {
		const data = await AuthService.register(req.body);
		return new Success.Created({
			message: 'Đăng ký thành công, vui lòng xác minh email của bạn',
			data,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function login(req, res, next) {
	try {
		const data = await AuthService.login(req.body);
		// Thiết lập cookie
		const cookiesOption = {
			httpOnly: true, // Chỉ cho phép truy cập từ server
			secure: true, // Chỉ cho phép truy cập từ server
			sameSite: 'None', // Cho phép gửi cookie giữa frontend & backend khác domain.
		};

		res.cookie('access_token', data.access_token, cookiesOption);
		res.cookie('refresh_token', data.refresh_token, cookiesOption);

		return new Success.Ok({
			message: 'Đăng nhập thành công',
			data,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function logout(req, res, next) {
	try {
		const result = await AuthService.logout(req.user);

		const cookiesOption = {
			httpOnly: true,
			secure: true,
			sameSite: 'None',
		};

		res.clearCookie('access_token', cookiesOption);
		res.clearCookie('refresh_token', cookiesOption);

		return new Success.Ok({
			message: 'Đăng xuất thành công',
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function verifyEmail(req, res, next) {
	try {
		await AuthService.verifyEmail(req.query);
		// Chuyển hướng về frontend với thông báo xác thực thành công
		return res.redirect(`${env.FRONTEND_URL}/auth/login?verify=true`);
	} catch (error) {
		return res.redirect(`${env.FRONTEND_URL}/auth/login?verify=false`);
	}
}

export async function forgotPassword(req, res, next) {
	try {
		await AuthService.forgotPassword(req.body);
		return new Success.Ok({
			message: 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu',
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function verifyOTP(req, res, next) {
	try {
		await AuthService.verifyOTP(req.body);
		return new Success.Ok({
			message: 'Xác thực thành công',
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function resetPassword(req, res, next) {
	try {
		await AuthService.resetPassword(req.body);
		return new Success.Ok({
			message: 'Đặt lại mật khẩu thành công',
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function refreshToken(req, res, next) {
	try {
		const refreshToken =
			req?.headers['authorization']?.split(' ')[1] ||
			req.cookies.refresh_token;

		const data = await AuthService.refreshToken(refreshToken, req.user.id);
		const cookiesOption = {
			httpOnly: true,
			secure: true,
			sameSite: 'None', // Cho phép gửi cookie giữa frontend & backend khác domain.
		};

		res.cookie('access_token', data.access_token, cookiesOption);

		return new Success.Ok({
			message: 'Token mới được tạo',
			data,
		}).send(res);
	} catch (error) {
		next(error);
	}
}
export const getAuthUser = async (req, res, next) => {
	try {
		const data = await AuthService.getAuthUser(req.user.id);
		return new Success.Ok({
			message: 'Lấy thông tin người dùng thành công',
			data,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export async function authSocial(req, res, next) {
	try {
		const data = await AuthService.authSocial(req.body);
		// Tùy chọn cooki
		const cookiesOption = {
			httpOnly: true,
			secure: true,
			sameSite: 'None',
		};

		// Gửi cookies vào response
		res.cookie('access_token', data.access_token, cookiesOption);
		res.cookie('refresh_token', data.refresh_token, cookiesOption);

		// Trả về thông tin người dùng và token
		return new Success.Ok({
			message: 'Đăng nhập thành công với tài khoản mạng xã hội',
			data,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function sendPhoneOTP(req, res, next) {
	try {
		await AuthService.sendPhoneOTP(req.user.id, req.body.phoneNumber);
		return new Success.Ok({
			message: 'Đã gửi mã OTP đến số điện thoại của bạn',
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function verifyPhoneOTP(req, res, next) {
	try {
		await AuthService.verifyPhoneOTP(
			req.user.id,
			req.body.phoneNumber,
			req.body.otp,
		);
		return new Success.Ok({
			message: 'Xác thực thành công',
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function changeEmail(req, res, next) {
	try {
		await AuthService.changeEmail(req.user.id, req.body.newEmail);
		return new Success.Ok({
			message: 'Đã gửi mã đến email mới của bạn',
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function verifyChangeEmail(req, res, next) {
	try {
		await AuthService.verifyChangeEmail(req.body);
		return new Success.Ok({
			message: 'Thay đổi email thành công',
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function changePassword(req, res, next) {
	try {
		const result = await AuthService.changePassword(req.user.id, req.body);

		// Đăng xuất người dùng
		const cookiesOption = {
			httpOnly: true,
			secure: true,
			sameSite: 'None',
		};

		res.clearCookie('access_token', cookiesOption);
		res.clearCookie('refresh_token', cookiesOption);

		return new Success.Ok({
			message: 'Đổi mật khẩu thành công',
			data: {
				passwordChangeTime: result,
			},
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function sendSMS(req, res, next) {
	try {
		const result = await AuthService.sendSMS(
			req.user.id,
			req.body.phoneNumber,
		);
		return new Success.Ok({
			message: 'Đã gửi mã OTP đến số điện thoại của bạn',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
}
