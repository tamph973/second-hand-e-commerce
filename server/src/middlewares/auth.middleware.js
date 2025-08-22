import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import redisClient from '../configs/redisConfig.js';
import { env } from '../configs/environment.js';
import Errors from '../common/response/error.response.js';

export const authenticateToken = async (req, res, next) => {
	try {
		const token =
			req?.headers['authorization']?.split(' ')[1] ||
			req?.cookies?.access_token;
		if (!token) {
			return res
				.status(401)
				.json({ message: 'Không có token, vui lòng đăng nhập' });
		}

		// 🛠 Kiểm tra nếu token đến từ Google
		const decoded = jwt.decode(token);

		if (!decoded) {
			return res.status(401).json({ message: 'Token không hợp lệ' });
		}
		// Kiểm tra token có trong blacklist không
		//console.log('>>> Check the token in TOKEN_BLACK_LIST');
		const isTokenBlacklisted = await redisClient.get(
			`TOKEN_BLACK_LIST_${decoded.id}_${decoded.jit}`,
		);

		if (isTokenBlacklisted) {
			return res.status(401).json({ message: 'Token bị thu hồi' });
		}

		// Xác thực token nội bộ (JWT)
		const verified = jwt.verify(token, env.JWT_SECRET_KEY);
		req.user = verified;

		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Token đã hết hạn' });
		}

		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ message: 'Token không hợp lệ' });
		}
		return res.status(500).json({
			message: 'Lỗi xác thực hệ thống',
			error: true,
		});
	}
};

export const isAdmin = async (req, res, next) => {
	try {
		const user = await userModel.findById(req.user.id);

		if (!user.role.includes('ADMIN')) {
			throw new Errors.ForbiddenError('Bạn không có quyền truy cập');
		}

		next();
	} catch (error) {
		next(error);
	}
};
