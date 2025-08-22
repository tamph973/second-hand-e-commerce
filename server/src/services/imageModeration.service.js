import ImageModerationModel from '../models/imageModeration.model.js';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { env } from '../configs/environment.js';

class ImageModerationService {
	constructor() {
		this.visionClient = new ImageAnnotatorClient({
			keyFilename: env.GOOGLE_CLOUD_KEY_FILE || './google-cloud-key.json',
		});
	}

	/**
	 * Kiểm duyệt một hình ảnh và lưu kết quả
	 */
	async moderateImage(file, userId, productId = null) {
		try {
			// Kiểm tra file
			if (!file || !file.buffer) {
				throw new Error('File không hợp lệ');
			}

			// Kiểm tra kích thước
			if (file.size > 10 * 1024 * 1024) {
				throw new Error('Kích thước file quá lớn (>10MB)');
			}

			// Kiểm tra định dạng
			const allowedTypes = [
				'image/jpeg',
				'image/jpg',
				'image/png',
				'image/webp',
			];
			if (!allowedTypes.includes(file.mimetype)) {
				throw new Error('Định dạng file không được hỗ trợ');
			}

			// Gọi Google Cloud Vision API
			const [result] = await this.visionClient.safeSearchDetection({
				image: { content: file.buffer },
			});

			const detections = result.safeSearchAnnotation;
			const moderationResult = this.analyzeModerationResult(detections);

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
				productId: productId,
				status: moderationResult.isAppropriate
					? 'APPROVED'
					: 'MANUAL_REVIEW',
			});

			await imageModeration.save();

			return {
				moderationId: imageModeration._id,
				...moderationResult,
			};
		} catch (error) {
			console.error('Image moderation service error:', error);
			throw error;
		}
	}

	/**
	 * Kiểm duyệt nhiều hình ảnh
	 */
	async moderateMultipleImages(files, userId, productId = null) {
		const promises = files.map(async (file) => {
			try {
				const result = await this.moderateImage(
					file,
					userId,
					productId,
				);
				return {
					filename: file.originalname,
					...result,
				};
			} catch (error) {
				return {
					filename: file.originalname,
					isAppropriate: false,
					error: error.message,
				};
			}
		});

		return await Promise.all(promises);
	}

	/**
	 * Phân tích kết quả kiểm duyệt
	 */
	analyzeModerationResult(detections) {
		const categories = [
			{ name: 'adult', likelihood: detections.adult },
			{ name: 'violence', likelihood: detections.violence },
			{ name: 'racy', likelihood: detections.racy },
			{ name: 'spoof', likelihood: detections.spoof },
			{ name: 'medical', likelihood: detections.medical },
			{ name: 'hate', likelihood: detections.hate },
			{ name: 'terror', likelihood: detections.terror },
		];

		const rejectedCategories = [];
		const warnedCategories = [];

		// Ngưỡng cho e-commerce
		const thresholds = {
			adult: { reject: 'VERY_LIKELY', warn: 'LIKELY' },
			violence: { reject: 'VERY_LIKELY', warn: 'LIKELY' },
			racy: { reject: 'VERY_LIKELY', warn: 'LIKELY' },
			hate: { reject: 'LIKELY', warn: 'POSSIBLE' },
			terror: { reject: 'LIKELY', warn: 'POSSIBLE' },
			medical: { reject: 'VERY_LIKELY', warn: 'LIKELY' },
			spoof: { reject: 'VERY_LIKELY', warn: 'LIKELY' },
		};

		categories.forEach((cat) => {
			const threshold = thresholds[cat.name];
			if (threshold) {
				if (this.isLikelihoodHigher(cat.likelihood, threshold.reject)) {
					rejectedCategories.push(cat.name);
				} else if (
					this.isLikelihoodHigher(cat.likelihood, threshold.warn)
				) {
					warnedCategories.push(cat.name);
				}
			}
		});

		const isAppropriate = rejectedCategories.length === 0;
		const confidence = this.calculateConfidence(detections);
		const riskLevel = this.calculateRiskLevel(
			rejectedCategories,
			warnedCategories,
			confidence,
		);

		return {
			isAppropriate,
			confidence,
			riskLevel,
			categories,
			rejectedCategories,
			warnedCategories,
		};
	}

	/**
	 * So sánh mức độ likelihood
	 */
	isLikelihoodHigher(likelihood, threshold) {
		const levels = [
			'VERY_UNLIKELY',
			'UNLIKELY',
			'POSSIBLE',
			'LIKELY',
			'VERY_LIKELY',
		];
		return levels.indexOf(likelihood) >= levels.indexOf(threshold);
	}

	/**
	 * Tính độ tin cậy
	 */
	calculateConfidence(detections) {
		const likelihoodScores = {
			VERY_UNLIKELY: 0,
			UNLIKELY: 0.25,
			POSSIBLE: 0.5,
			LIKELY: 0.75,
			VERY_LIKELY: 1,
		};

		const categories = [
			detections.adult,
			detections.violence,
			detections.racy,
			detections.spoof,
			detections.medical,
			detections.hate,
			detections.terror,
		];

		const averageScore =
			categories.reduce((sum, likelihood) => {
				return sum + likelihoodScores[likelihood];
			}, 0) / categories.length;

		return Math.round((1 - averageScore) * 100);
	}

	/**
	 * Tính mức độ rủi ro
	 */
	calculateRiskLevel(rejectedCategories, warnedCategories, confidence) {
		if (rejectedCategories.length > 0) {
			return 'HIGH';
		} else if (warnedCategories.length > 0 || confidence < 70) {
			return 'MEDIUM';
		} else {
			return 'LOW';
		}
	}

	/**
	 * Lấy thống kê kiểm duyệt
	 */
	async getModerationStats() {
		return await ImageModerationModel.getStats();
	}

	/**
	 * Lấy thống kê theo khoảng thời gian
	 */
	async getModerationStatsByDateRange(startDate, endDate) {
		return await ImageModerationModel.getStatsByDateRange(
			startDate,
			endDate,
		);
	}

	/**
	 * Lấy lịch sử kiểm duyệt của user
	 */
	async getUserModerationHistory(userId, options = {}) {
		const { page = 1, limit = 10, status, riskLevel } = options;

		const query = { userId, _destroy: { $ne: true } };
		if (status) query.status = status;
		if (riskLevel) query.riskLevel = riskLevel;

		const queryOptions = {
			page: parseInt(page),
			limit: parseInt(limit),
			sort: { createdAt: -1 },
			populate: [
				{ path: 'productId', select: 'title slug' },
				{ path: 'reviewedBy', select: 'username email' },
			],
		};

		return await ImageModerationModel.paginate(query, queryOptions);
	}

	/**
	 * Lấy danh sách cần review thủ công
	 */
	async getPendingReviews(options = {}) {
		const { page = 1, limit = 20, riskLevel } = options;

		const query = {
			status: 'MANUAL_REVIEW',
			_destroy: { $ne: true },
		};

		if (riskLevel) query.riskLevel = riskLevel;

		const queryOptions = {
			page: parseInt(page),
			limit: parseInt(limit),
			sort: { createdAt: -1 },
			populate: [
				{ path: 'userId', select: 'username email' },
				{ path: 'productId', select: 'title slug' },
			],
		};

		return await ImageModerationModel.paginate(query, queryOptions);
	}

	/**
	 * Review thủ công
	 */
	async reviewImage(moderationId, action, reviewerId, note = '') {
		const imageModeration = await ImageModerationModel.findById(
			moderationId,
		);

		if (!imageModeration) {
			throw new Error('Không tìm thấy hình ảnh cần review');
		}

		if (action === 'approve') {
			await imageModeration.approve(reviewerId, note);
		} else if (action === 'reject') {
			await imageModeration.reject(reviewerId, note);
		} else {
			throw new Error('Hành động không hợp lệ');
		}

		return imageModeration;
	}

	/**
	 * Kiểm tra trạng thái kiểm duyệt của sản phẩm
	 */
	async getProductModerationStatus(productId) {
		const moderations = await ImageModerationModel.find({
			productId: productId,
			_destroy: { $ne: true },
		}).sort({ createdAt: -1 });

		const pendingCount = moderations.filter(
			(m) => m.status === 'MANUAL_REVIEW',
		).length;
		const rejectedCount = moderations.filter(
			(m) => m.status === 'REJECTED',
		).length;
		const approvedCount = moderations.filter(
			(m) => m.status === 'APPROVED',
		).length;

		return {
			totalImages: moderations.length,
			pendingCount,
			rejectedCount,
			approvedCount,
			hasPendingReviews: pendingCount > 0,
			hasRejectedImages: rejectedCount > 0,
			moderations,
		};
	}
}

export default new ImageModerationService();
