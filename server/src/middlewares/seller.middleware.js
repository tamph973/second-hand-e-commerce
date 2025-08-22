import userModel from '../models/user.model.js';
import Errors from '../common/response/error.response.js';

// Middleware kiểm tra user có phải là seller không
export const isSeller = async (req, res, next) => {
	try {
		const user = await userModel.findById(req.user.id);

		if (!user) {
			throw new Errors.NotFoundError('Không tìm thấy người dùng');
		}

		if (!user.role.includes('SELLER') && !user.role.includes('ADMIN')) {
			throw new Errors.ForbiddenError(
				'Bạn không có quyền thực hiện hành động này',
			);
		}

		req.seller = user;
		next();
	} catch (error) {
		next(error);
	}
};

// Middleware kiểm tra seller đã được xác minh chưa
export const isVerifiedSeller = async (req, res, next) => {
	try {
		const user = await userModel.findById(req.user.id);

		if (!user) {
			throw new Errors.NotFoundError('Không tìm thấy người dùng');
		}

		if (!user.sellerVerification.isVerified) {
			throw new Errors.ForbiddenError(
				'Tài khoản của bạn chưa được xác minh. Vui lòng hoàn tất quá trình xác minh để đăng bán sản phẩm',
			);
		}

		if (user.sellerVerification.verificationLevel === 'NONE') {
			throw new Errors.ForbiddenError(
				'Bạn cần nâng cấp cấp độ xác minh để đăng bán sản phẩm',
			);
		}

		if (user.status !== 'ACTIVE') {
			throw new Errors.ForbiddenError(
				'Tài khoản của bạn đang bị khóa hoặc tạm ngưng',
			);
		}

		req.seller = user;
		next();
	} catch (error) {
		next(error);
	}
};

// Middleware kiểm tra giới hạn đăng sản phẩm
export const checkProductLimits = async (req, res, next) => {
	try {
		const user = await userModel.findById(req.user.id);
		const { price } = req.body;

		// Kiểm tra giới hạn giá
		if (price && !user.canCreateProductWithPrice(price)) {
			const limits = {
				BASIC: '500,000 VNĐ',
				ADVANCED: '2,000,000 VNĐ',
				PREMIUM: '10,000,000 VNĐ',
			};

			throw new Errors.ForbiddenError(
				`Giá sản phẩm vượt quá giới hạn cho phép. Cấp độ ${
					user.sellerVerification.verificationLevel
				} chỉ được phép đăng sản phẩm tối đa ${
					limits[user.sellerVerification.verificationLevel]
				}`,
			);
		}

		// Kiểm tra giới hạn số lượng sản phẩm (cần query từ database)
		// Đây sẽ được implement trong service layer

		next();
	} catch (error) {
		next(error);
	}
};

// Middleware kiểm tra giới hạn upload hàng ngày
export const checkDailyUploadLimit = async (req, res, next) => {
	try {
		const user = await userModel.findById(req.user.id);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Đếm số sản phẩm đã upload hôm nay
		const ProductModel = (await import('../models/product.model.js'))
			.default;
		const todayProducts = await ProductModel.countDocuments({
			userId: user._id,
			createdAt: { $gte: today },
		});

		if (todayProducts >= user.sellerVerification.limits.dailyUploadLimit) {
			throw new Errors.ForbiddenError(
				`Bạn đã đạt giới hạn upload ${user.sellerVerification.limits.dailyUploadLimit} sản phẩm/ngày. Vui lòng thử lại vào ngày mai hoặc nâng cấp tài khoản`,
			);
		}

		next();
	} catch (error) {
		next(error);
	}
};

// Middleware kiểm tra cấp độ xác minh tối thiểu
export const requireVerificationLevel = (minLevel) => {
	return async (req, res, next) => {
		try {
			const user = await userModel.findById(req.user.id);
			const levels = ['NONE', 'BASIC', 'ADVANCED', 'PREMIUM'];
			const userLevelIndex = levels.indexOf(
				user.sellerVerification.verificationLevel,
			);
			const minLevelIndex = levels.indexOf(minLevel);

			if (userLevelIndex < minLevelIndex) {
				throw new Errors.ForbiddenError(
					`Hành động này yêu cầu cấp độ xác minh tối thiểu là ${minLevel}. Hiện tại bạn đang ở cấp độ ${user.sellerVerification.verificationLevel}`,
				);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
