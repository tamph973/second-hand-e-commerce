import * as SellerService from '../services/seller.service.js';
import Success from '../common/response/success.response.js';

// Đăng ký làm seller
export const registerAsSeller = async (req, res, next) => {
	try {
		const result = await SellerService.registerAsSeller(
			req.user.id,
			req.body,
		);
		return new Success.Created({
			message: result.message,
			data: result.user,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Xác minh CCCD
export const verifyCCCD = async (req, res, next) => {
	try {
		const result = await SellerService.verifyCCCD(
			req.user.id,
			req.body,
			req,
		);
		return new Success.Ok({
			message: result.message,
			data: {
				verificationLevel: result.verificationLevel,
				isVerified: result.isVerified,
				images: result.images,
			},
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Xác minh tài khoản ngân hàng
export const verifyBankAccount = async (req, res, next) => {
	try {
		const result = await SellerService.verifyBankAccount(
			req.user.id,
			req.body,
		);
		return new Success.Ok({
			message: result.message,
			data: {
				verificationLevel: result.verificationLevel,
				isVerified: result.isVerified,
			},
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Nâng cấp cấp độ xác minh
export const upgradeVerificationLevel = async (req, res, next) => {
	try {
		const { targetLevel } = req.body;
		const result = await SellerService.upgradeVerificationLevel(
			req.user.id,
			targetLevel,
		);
		return new Success.Ok({
			message: result.message,
			data: {
				verificationLevel: result.verificationLevel,
				limits: result.limits,
			},
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Lấy thông tin seller
export const getSellerInfo = async (req, res, next) => {
	try {
		const result = await SellerService.getSellerInfo(req.params.sellerId);
		return new Success.Ok({
			message: 'Lấy thông tin seller thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Cập nhật thông tin seller
export const updateSellerInfo = async (req, res, next) => {
	try {
		const result = await SellerService.updateSellerInfo(
			req.user.id,
			req.body,
		);
		return new Success.Ok({
			message: result.message,
			data: result.user,
		}).send(res);
	} catch (error) {
		next(error);
	}
};
