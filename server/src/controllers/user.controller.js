import * as UserService from '../services/user.service.js';
import Success from '../common/response/success.response.js';

export async function getUserData(req, res) {
	try {
		const user = await UserService.getUserService(req.user.id);
		return new Success.Ok({
			message: 'Thông tin người dùng',
			data: user,
		}).send(res);
	} catch (error) {
		const statusCode = error.status;
		return res.status(statusCode).json({ error: error.message });
	}
}

export async function updateUser(req, res) {
	try {
		await UserService.updateUserService(req.user.id, req.body);
		return new Success.Ok({
			message: 'Cập nhật thông tin thành công',
		}).send(res);
	} catch (error) {
		const statusCode = error.status;
		return res.status(statusCode).json({ error: error.message });
	}
}

export async function changePassword(req, res) {
	// Xử lý đổi mật khẩu => logout => navigate login
	try {
		await UserService.changePassword(req.user.id, req.body);
		return new Success.Ok({
			message: 'Đổi mật khẩu thành công',
		}).send(res);
	} catch (error) {
		const statusCode = error.status;
		return res.status(statusCode).json({ error: error.message });
	}
}

export const getAllUser = async (req, res, next) => {
	try {
		const users = await UserService.getAllUser();
		return new Success.Ok({
			message: 'Lấy danh sách người dùng thành công',
			data: users,
		}).send(res);
	} catch (error) {
		next(error);
	}
};
