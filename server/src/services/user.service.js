import UserModel from '../models/user.model.js';
import Errors from '../common/response/error.response.js';
import sendEmail from '../configs/sendEmail.js';
import { changePasswordTemplate } from '../templates/index.js';
import bcrypt from 'bcrypt';
import convertDate from '../utils/convertDate.js';

export async function getUserService(userId) {
	const user = await UserModel.findOne({ _id: userId });
	if (!user) {
		throw new Errors.NotFoundError(
			'Người dùng không tồn tại trong hệ thống',
		);
	}
	return user;
}

export async function updateUserService(id, data) {
	const user = await UserModel.findById(id);
	if (!user) {
		throw new Errors.NotFoundError(
			'Người dùng không tồn tại trong hệ thống',
		);
	}

	const payload = {
		...(data.fullName && { fullName: data.fullName }),
		...(data.avatar && { avatar: data.avatar }),
		...(data.dob && { dob: data.dob }),
		...(data.gender && { gender: data.gender }),
	};

	return await UserModel.findByIdAndUpdate(id, payload, { new: true });
}

export async function changePassword(id, data) {
	// Xử lý đổi mật khẩu => logout => navigate login
	const { currentPassword, newPassword, confirmPassword } = data;
	const user = await UserModel.findById(id).select('+password');
	if (!user) {
		throw new Errors.NotFoundError(
			'Người dùng không tồn tại trong hệ thống',
		);
	}

	const checkCurrPassword = await user.isPasswordMatched(currentPassword);
	if (!checkCurrPassword) {
		throw new Errors.BadRequestError('Mật khẩu hiện tại không đúng');
	}

	if (!currentPassword || !newPassword || !confirmPassword) {
		throw new Errors.BadRequestError('Vui lòng điền đầy đủ thông tin');
	}

	if (newPassword !== confirmPassword) {
		throw new Errors.BadRequestError('Xác nhận mật khẩu không khớp');
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(newPassword, salt);

	// Cập nhật mật khẩu
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
// Chỉ lấy người dùng không phải là admin
export async function getAllUser() {
	const users = await UserModel.find({
		role: { $ne: 'ADMIN' },
	}).select('-password');

	const total = await UserModel.countDocuments({
		role: { $ne: 'ADMIN' },
	});

	const result = users.map((user) => ({
		id: user._id,
		fullName: user.fullName,
		email: user.email,
		phoneNumber: user.phoneNumber,
		avatar: user.avatar,
		role: user.role,
	}));
	return {
		users: result,
		total,
	};
}
