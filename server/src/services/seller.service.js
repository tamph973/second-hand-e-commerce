import userModel from '../models/user.model.js';
import Errors from '../common/response/error.response.js';
import {
	handleCCCDUpload,
	validateCCCDImages,
} from '../utils/cccdUploadUtils.js';
import productModel from '../models/product.model.js';

// Service xử lý đăng ký làm seller
export const registerAsSeller = async (userId, sellerData) => {
	const user = await userModel.findById(userId);

	if (!user) {
		throw new Errors.NotFoundError('Không tìm thấy người dùng');
	}

	if (user.role === 'SELLER') {
		throw new Errors.BadRequestError('Bạn đã là người bán');
	}

	// Cập nhật thông tin seller
	if (!user.role.includes('SELLER')) {
		user.role.push('SELLER');
	}

	// Xác định loại hình người bán
	const sellerType = sellerData.sellerType || 'PERSONAL';

	// Nếu là BUSINESS thì kiểm tra các trường bắt buộc
	if (sellerType === 'BUSINESS') {
		if (
			!sellerData.businessLicense ||
			!sellerData.taxCode ||
			!sellerData.businessAddress
		) {
			throw new Errors.BadRequestError(
				'Vui lòng cung cấp đầy đủ giấy phép kinh doanh, mã số thuế và địa chỉ kinh doanh cho người bán doanh nghiệp',
			);
		}
	} else if (sellerType === 'PERSONAL') {
		// Kiểm tra các trường cơ bản cho cá nhân
		if (
			!sellerData.fullName ||
			!sellerData.email ||
			!sellerData.phoneNumber
		) {
			throw new Errors.BadRequestError(
				'Vui lòng cập nhật đầy đủ họ tên, email và số điện thoại trước khi đăng ký làm người bán cá nhân',
			);
		}
	}

	user.sellerVerification.businessInfo = {
		businessName: sellerData.businessName || '',
		businessLicense: sellerData.businessLicense || '',
		businessAddress: sellerData.businessAddress || '',
		taxCode: sellerData.taxCode || '',
		sellerType: sellerType,
	};

	await user.save();

	return {
		message: 'Đăng ký làm người bán thành công',
		user: {
			id: user._id,
			fullName: sellerData.fullName,
			email: sellerData.email,
			phoneNumber: sellerData.phoneNumber,
			role: user.role,
			sellerVerification: user.sellerVerification,
		},
	};
};

// Service xử lý xác minh CCCD
export const verifyCCCD = async (userId, cccdData, req) => {
	const user = await userModel.findById(userId);

	if (!user) {
		throw new Errors.NotFoundError('Không tìm thấy người dùng');
	}

	if (!user.role.includes('SELLER')) {
		throw new Errors.ForbiddenError('Bạn cần đăng ký làm người bán trước');
	}

	// Nếu đã xác minh CCCD, không cho xác minh lại (có thể mở rộng ghi log lịch sử)
	if (user.sellerVerification.cccdVerified) {
		throw new Errors.BadRequestError(
			'Bạn đã xác minh CCCD trước đó. Vui lòng liên hệ hỗ trợ nếu cần cập nhật.',
		);
	}

	// Kiểm tra dữ liệu đầu vào
	if (!cccdData.cccdNumber) {
		throw new Errors.BadRequestError('Vui lòng nhập số CCCD');
	}
	if (!cccdData.cccdIssuedPlace) {
		throw new Errors.BadRequestError('Vui lòng nhập nơi cấp CCCD');
	}
	if (!cccdData.cccdIssuedDate) {
		throw new Errors.BadRequestError('Vui lòng nhập ngày cấp CCCD');
	}
	if (!cccdData.cccdExpiredDate) {
		throw new Errors.BadRequestError('Vui lòng nhập ngày hết hạn CCCD');
	}

	// Validate file ảnh trước khi upload (nếu có file upload)
	// if (req.files && req.files.cccdFront && req.files.cccdBack) {
	// 	validateCCCDImages(req.files.cccdFront[0], req.files.cccdBack[0]);
	// } else if (req.files && Array.isArray(req.files) && req.files.length >= 2) {
	// 	validateCCCDImages(req.files[0], req.files[1]);
	// }

	// Xử lý upload ảnh CCCD
	const cccdImages = await handleCCCDUpload(req);

	// Cập nhật thông tin CCCD
	user.sellerVerification.cccdNumber = cccdData.cccdNumber;
	user.sellerVerification.cccdFrontImage = cccdImages.front;
	user.sellerVerification.cccdBackImage = cccdImages.back;
	user.sellerVerification.cccdIssuedPlace = cccdData.cccdIssuedPlace;
	user.sellerVerification.cccdIssuedDate = cccdData.cccdIssuedDate;
	user.sellerVerification.cccdExpiredDate = cccdData.cccdExpiredDate;

	// Tách logic xác minh AI thành hàm riêng (mock)
	// const aiVerified = await mockVerifyCCCDWithAI(cccdData, cccdImages);
	user.sellerVerification.cccdVerified = true; // tạm thời set true

	if (user.sellerVerification.cccdVerified) {
		user.sellerVerification.cccdVerifiedAt = new Date();
		user.sellerVerification.verificationMethod = 'CCCD';
		user.sellerVerification.isVerified = true;
		await user.upgradeVerificationLevel('BASIC');
	}

	await user.save();

	return {
		message: 'Xác minh CCCD thành công',
		verificationLevel: user.sellerVerification.verificationLevel,
		isVerified: user.sellerVerification.isVerified,
		images: {
			front: cccdImages.front.url,
			back: cccdImages.back.url,
		},
	};
};

// Hàm mock xác minh AI (có thể thay thế bằng tích hợp thật sau này)
const mockVerifyCCCDWithAI = async (cccdData, cccdImages) => {
	// TODO: Tích hợp AI thật ở đây
	return true; // Mặc định luôn xác minh thành công
};

// Service xác minh tài khoản ngân hàng
export const verifyBankAccount = async (userId, bankData) => {
	const user = await userModel.findById(userId);

	if (!user) {
		throw new Errors.NotFoundError('Không tìm thấy người dùng');
	}

	if (!user.role.includes('SELLER')) {
		throw new Errors.ForbiddenError('Bạn cần đăng ký làm người bán trước');
	}

	// Cập nhật thông tin ngân hàng
	user.sellerVerification.bankAccount = {
		accountNumber: bankData.accountNumber,
		accountName: bankData.accountName,
		bankName: bankData.bankName,
		verified: false,
		verifiedAt: null,
	};

	// TODO: Tích hợp API ngân hàng để xác minh
	// const bankVerification = await verifyBankAccountAPI(bankData);
	user.sellerVerification.bankAccount.verified = true; // Tạm thời set true

	if (user.sellerVerification.bankAccount.verified) {
		user.sellerVerification.bankAccount.verifiedAt = new Date();

		// Nâng cấp level nếu chưa có CCCD
		if (user.sellerVerification.verificationLevel === 'NONE') {
			user.sellerVerification.verificationLevel = 'BASIC';
			user.sellerVerification.isVerified = true;
		} else if (user.sellerVerification.verificationLevel === 'BASIC') {
			user.sellerVerification.verificationLevel = 'ADVANCED';
		}

		user.sellerVerification.verificationMethod = 'BANK_ACCOUNT';
	}

	await user.save();

	return {
		message: 'Xác minh tài khoản ngân hàng thành công',
		verificationLevel: user.sellerVerification.verificationLevel,
		isVerified: user.sellerVerification.isVerified,
	};
};

// Service nâng cấp cấp độ xác minh
export const upgradeVerificationLevel = async (userId, targetLevel) => {
	const user = await userModel.findById(userId);

	if (!user) {
		throw new Errors.NotFoundError('Không tìm thấy người dùng');
	}

	if (!user.role.includes('SELLER')) {
		throw new Errors.ForbiddenError('Bạn cần đăng ký làm người bán trước');
	}

	const success = await user.upgradeVerificationLevel(targetLevel);

	if (!success) {
		throw new Errors.BadRequestError('Không thể nâng cấp cấp độ xác minh');
	}

	return {
		message: `Nâng cấp cấp độ xác minh thành công: ${targetLevel}`,
		verificationLevel: user.sellerVerification.verificationLevel,
		limits: user.sellerVerification.limits,
	};
};

// Service lấy thông tin seller
export const getSellerInfo = async (sellerId) => {
	const user = await userModel
		.findById(sellerId)
		.select('-password -refresh_token')
		.populate({
			path: 'address',
			select: 'addressDetail wardName districtName provinceName',
		});

	if (!user) {
		throw new Errors.NotFoundError('Không tìm thấy người dùng');
	}

	if (!user.role.includes('SELLER')) {
		throw new Errors.ForbiddenError('Bạn không phải là người bán');
	}

	// Số sản phẩm đang có trong shop
	const productCount = await productModel.countDocuments({
		userId: user._id,
	});

	// Số sản phẩm đã bán
	const sold = await productModel.aggregate([
		{ $match: { userId: user._id } },
		{ $group: { _id: null, totalSold: { $sum: '$sold' } } },
	]);
	return {
		id: user._id,
		fullName: user.fullName,
		email: user.email,
		phoneNumber: user.phoneNumber,
		address: user.address,
		avatar: user.avatar,
		role: user.role,
		sellerVerification: user.sellerVerification,
		isEmailVerified: user.isEmailVerified,
		isPhoneVerified: user.isPhoneVerified,
		createdAt: user.createdAt,
		productCount,
		sold: sold[0].totalSold,
		lastActive: user.lastActive || null,
	};
};

// Service cập nhật thông tin seller
export const updateSellerInfo = async (userId, updateData) => {
	const user = await userModel.findById(userId);

	if (!user) {
		throw new Errors.NotFoundError('Không tìm thấy người dùng');
	}

	if (user.role !== 'SELLER') {
		throw new Errors.ForbiddenError('Bạn không phải là người bán');
	}

	// Cập nhật thông tin cơ bản
	if (updateData.fullName) user.fullName = updateData.fullName;
	if (updateData.phoneNumber) user.phoneNumber = updateData.phoneNumber;
	if (updateData.avatar) user.avatar = updateData.avatar;

	// Cập nhật thông tin business
	if (updateData.businessInfo) {
		user.sellerVerification.businessInfo = {
			...user.sellerVerification.businessInfo,
			...updateData.businessInfo,
		};
	}

	await user.save();

	return {
		message: 'Cập nhật thông tin thành công',
		user: {
			id: user._id,
			fullName: user.fullName,
			email: user.email,
			phoneNumber: user.phoneNumber,
			avatar: user.avatar,
			role: user.role,
			sellerVerification: user.sellerVerification,
		},
	};
};
