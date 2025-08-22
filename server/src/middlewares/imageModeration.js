import ImageModerationController from '../controllers/imageModeration.controller.js';
import ImageModerationModel from '../models/imageModeration.model.js';

/**
 * Middleware kiểm duyệt hình ảnh sản phẩm
 * Tự động kiểm tra và lưu kết quả vào database
 */
export const moderateProductImages = async (req, res, next) => {
	try {
		// Kiểm tra xem có bật kiểm duyệt không
		if (!ImageModerationController.moderationConfig.enabled) {
			return next();
		}

		const files = req.files || (req.file ? [req.file] : []);
		if (files.length === 0) {
			return next();
		}

		const moderationResults = [];
		const userId = req.user.id;

		// Kiểm tra từng hình ảnh
		for (const file of files) {
			try {
				// Kiểm tra kích thước và định dạng
				if (file.size > 10 * 1024 * 1024) {
					moderationResults.push({
						filename: file.originalname,
						isAppropriate: false,
						error: 'Kích thước file quá lớn (>10MB)',
					});
					continue;
				}

				const allowedTypes = [
					'image/jpeg',
					'image/jpg',
					'image/png',
					'image/webp',
				];
				if (!allowedTypes.includes(file.mimetype)) {
					moderationResults.push({
						filename: file.originalname,
						isAppropriate: false,
						error: 'Định dạng file không được hỗ trợ',
					});
					continue;
				}

				// Gọi Google Cloud Vision API
				const [result] =
					await ImageModerationController.visionClient.safeSearchDetection(
						{
							image: { content: file.buffer },
						},
					);

				const detections = result.safeSearchAnnotation;
				const moderationResult =
					ImageModerationController.analyzeModerationResult(
						detections,
					);

				// Lưu kết quả vào database
				const imageModeration = new ImageModerationModel({
					filename: file.filename || file.originalname,
					originalName: file.originalname,
					mimeType: file.mimetype,
					size: file.size,
					isAppropriate: moderationResult.isAppropriate,
					confidence: moderationResult.confidence,
					riskLevel: moderationResult.riskLevel,
					categories: moderationResult.categories,
					rejectedCategories: moderationResult.rejectedCategories,
					warnedCategories: moderationResult.warnedCategories,
					userId: userId,
					ipAddress: req.ip,
					userAgent: req.get('User-Agent'),
					status: moderationResult.isAppropriate
						? 'APPROVED'
						: 'MANUAL_REVIEW',
				});

				await imageModeration.save();

				moderationResults.push({
					filename: file.originalname,
					moderationId: imageModeration._id,
					...moderationResult,
				});
			} catch (error) {
				console.error('Error moderating image:', error);
				moderationResults.push({
					filename: file.originalname,
					isAppropriate: false,
					error: error.message,
				});
			}
		}

		// Kiểm tra xem có hình ảnh nào bị từ chối không
		const hasRejectedImages = moderationResults.some(
			(result) => !result.isAppropriate && !result.error,
		);

		if (
			hasRejectedImages &&
			ImageModerationController.moderationConfig.autoReject
		) {
			return res.status(400).json({
				success: false,
				message: 'Một số hình ảnh không đạt tiêu chuẩn kiểm duyệt',
				moderationResults,
			});
		}

		// Lưu kết quả kiểm duyệt vào request để sử dụng sau
		req.moderationResults = moderationResults;
		next();
	} catch (error) {
		console.error('Product image moderation error:', error);
		if (ImageModerationController.moderationConfig.strictMode) {
			return res.status(500).json({
				success: false,
				message: 'Lỗi kiểm duyệt hình ảnh sản phẩm',
			});
		}
		next();
	}
};

/**
 * Middleware kiểm tra trạng thái kiểm duyệt trước khi hiển thị sản phẩm
 */
export const checkProductModerationStatus = async (req, res, next) => {
	try {
		const productId = req.params.id || req.body.productId;

		if (!productId) {
			return next();
		}

		// Kiểm tra xem sản phẩm có hình ảnh nào đang chờ review không
		const pendingModerations = await ImageModerationModel.find({
			productId: productId,
			status: 'MANUAL_REVIEW',
			_destroy: { $ne: true },
		});

		if (pendingModerations.length > 0) {
			req.productModerationStatus = {
				hasPendingReviews: true,
				pendingCount: pendingModerations.length,
				moderations: pendingModerations,
			};
		}

		next();
	} catch (error) {
		console.error('Check product moderation status error:', error);
		next();
	}
};

/**
 * Middleware lưu thông tin kiểm duyệt vào sản phẩm
 */
export const saveModerationToProduct = async (req, res, next) => {
	try {
		if (!req.moderationResults || !req.body.productId) {
			return next();
		}

		const productId = req.body.productId;
		const moderationIds = req.moderationResults
			.filter((result) => result.moderationId)
			.map((result) => result.moderationId);

		// Cập nhật productId cho các bản ghi kiểm duyệt
		if (moderationIds.length > 0) {
			await ImageModerationModel.updateMany(
				{ _id: { $in: moderationIds } },
				{ productId: productId },
			);
		}

		next();
	} catch (error) {
		console.error('Save moderation to product error:', error);
		next();
	}
};
