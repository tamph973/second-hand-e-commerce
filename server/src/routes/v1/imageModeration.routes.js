import { Router } from 'express';
import ImageModerationController from '../../controllers/imageModeration.controller.js';
import upload from '../../middlewares/multer.js';
import {
	authenticateToken,
	isAdmin,
} from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route   POST /api/v1/image-moderation/check
 * @desc    Kiểm tra một hình ảnh
 * @access  Private (cần đăng nhập)
 */
router.post(
	'/check',
	upload.single('image'),
	ImageModerationController.checkImageModeration,
);

/**
 * @route   POST /api/v1/image-moderation/check-multiple
 * @desc    Kiểm tra nhiều hình ảnh cùng lúc
 * @access  Private (cần đăng nhập)
 */
router.post(
	'/check-multiple',
	upload.array('images', 10),
	ImageModerationController.checkMultipleImages,
);

/**
 * @route   POST /api/v1/image-moderation/check-product-images
 * @desc    Kiểm tra hình ảnh sản phẩm (middleware tích hợp)
 * @access  Private (cần đăng nhập)
 */
router.post(
	'/check-product-images',
	authenticateToken,
	upload.array('images', 10),
	ImageModerationController.moderateProductImages,
	(req, res) => {
		// Sau khi kiểm duyệt thành công, tiếp tục xử lý
		res.json({
			success: true,
			message: 'Kiểm duyệt hình ảnh sản phẩm thành công',
			moderationResults: req.moderationResults,
		});
	},
);

/**
 * @route   GET /api/v1/image-moderation/stats
 * @desc    Lấy thống kê kiểm duyệt
 * @access  Private (chỉ admin)
 */
router.get(
	'/stats',
	authenticateToken,
	isAdmin,
	ImageModerationController.getModerationStats,
);

/**
 * @route   PUT /api/v1/image-moderation/config
 * @desc    Cập nhật cấu hình kiểm duyệt
 * @access  Private (chỉ admin)
 */
router.put(
	'/config',
	authenticateToken,
	isAdmin,
	ImageModerationController.updateModerationConfig,
);

/**
 * @route   GET /api/v1/image-moderation/history
 * @desc    Lấy lịch sử kiểm duyệt của user
 * @access  Private (cần đăng nhập)
 */
router.get(
	'/history',
	authenticateToken,
	ImageModerationController.getModerationHistory,
);

/**
 * @route   GET /api/v1/image-moderation/pending-reviews
 * @desc    Lấy danh sách hình ảnh cần review thủ công
 * @access  Private (chỉ admin)
 */
router.get(
	'/pending-reviews',
	authenticateToken,
	isAdmin,
	ImageModerationController.getPendingReviews,
);

/**
 * @route   PUT /api/v1/image-moderation/:id/review
 * @desc    Review thủ công một hình ảnh
 * @access  Private (chỉ admin)
 */
router.put(
	'/:id/review',
	authenticateToken,
	isAdmin,
	ImageModerationController.reviewImage,
);

export const imageModerationRoutes = router;
