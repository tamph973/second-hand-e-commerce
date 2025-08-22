import { ImageAnnotatorClient } from '@google-cloud/vision';
import { env } from '../configs/environment.js';
import ImageModerationModel from '../models/imageModeration.model.js';

class ImageModerationController {
	constructor() {
		this.visionClient = new ImageAnnotatorClient({
			keyFilename: env.GOOGLE_CLOUD_KEY_FILE || './google-cloud-key.json',
		});

		// Cấu hình kiểm duyệt cho e-commerce - cân bằng giữa bảo mật và trải nghiệm người dùng
		this.moderationConfig = {
			enabled: env.IMAGE_MODERATION_ENABLED === 'true',
			strictMode: env.IMAGE_MODERATION_STRICT_MODE === 'true',
			autoReject: env.IMAGE_MODERATION_AUTO_REJECT === 'true',
			confidenceThreshold:
				parseFloat(env.IMAGE_MODERATION_CONFIDENCE_THRESHOLD) || 85,

			// Ngưỡng cho từng loại nội dung (nghiêm ngặt hơn)
			thresholds: {
				adult: {
					reject: 'POSSIBLE', // Chặn ngay khi có dấu hiệu nội dung người lớn
					warn: 'UNLIKELY', // Cảnh báo sớm với mọi dấu hiệu nghi ngờ
				},
				violence: {
					reject: 'UNLIKELY', // Chặn ngay cả với dấu hiệu bạo lực nhẹ
					warn: 'VERY_UNLIKELY', // Cảnh báo với mọi dấu hiệu bạo lực
				},
				racy: {
					reject: 'UNLIKELY', // Chặn nội dung gợi cảm ngay lập tức
					warn: 'VERY_UNLIKELY', // Cảnh báo với mọi nội dung gợi cảm
				},
				hate: {
					reject: 'UNLIKELY', // Chặn ngay với dấu hiệu thù ghét
					warn: 'VERY_UNLIKELY', // Cảnh báo sớm với mọi dấu hiệu
				},
				terror: {
					reject: 'UNLIKELY', // Chặn ngay với dấu hiệu khủng bố
					warn: 'VERY_UNLIKELY', // Cảnh báo với mọi nghi ngờ
				},
				medical: {
					reject: 'UNLIKELY', // Chặn nghiêm ngặt với thông tin y tế
					warn: 'VERY_UNLIKELY', // Cảnh báo sớm với thông tin y tế
				},
				spoof: {
					reject: 'UNLIKELY', // Chặn nghiêm ngặt với nội dung giả mạo
					warn: 'VERY_UNLIKELY', // Cảnh báo sớm với nội dung giả mạo
				},
			},

			// Cấu hình đặc biệt cho e-commerce (nghiêm ngặt hơn)
			ecommerceSettings: {
				allowProductImages: true, // Cho phép hình ảnh sản phẩm
				allowModelImages: false, // Không cho phép hình ảnh người mẫu (quần áo, trang sức)
				allowMedicalProducts: false, // Không cho phép sản phẩm y tế
				allowToyWeapons: false, // Không cho phép vũ khí đồ chơi
				allowHouseholdAppliances: true, // Cho phép thiết bị gia dụng
				allowElectronics: true, // Cho phép điện thoại và thiết bị điện tử
				strictBrandProtection: true, // Bảo vệ thương hiệu nghiêm ngặt
			},
		};
	}

	/**
	 * Kiểm tra hình ảnh có nội dung không phù hợp
	 */
	checkImageModeration = async (req, res) => {
		try {
			if (!req.file) {
				return res.status(400).json({
					success: false,
					message: 'Vui lòng cung cấp hình ảnh',
				});
			}

			// Kiểm tra kích thước file
			if (req.file.size > 10 * 1024 * 1024) {
				// 10MB
				return res.status(400).json({
					success: false,
					message: 'Kích thước hình ảnh không được vượt quá 10MB',
				});
			}

			// Kiểm tra định dạng file
			const allowedTypes = [
				'image/jpeg',
				'image/jpg',
				'image/png',
				'image/webp',
			];
			if (!allowedTypes.includes(req.file.mimetype)) {
				return res.status(400).json({
					success: false,
					message: 'Chỉ hỗ trợ định dạng JPEG, PNG, WebP',
				});
			}

			const imageBuffer = req.file.buffer;

			const [result] = await this.visionClient.safeSearchDetection({
				image: { content: imageBuffer },
			});

			const detections = result.safeSearchAnnotation;
			const moderationResult = this.analyzeModerationResult(detections);

			// Lưu kết quả kiểm duyệt vào request để sử dụng sau
			req.moderationResult = moderationResult;

			res.json({
				success: true,
				...moderationResult,
				message: moderationResult.isAppropriate
					? 'Hình ảnh phù hợp'
					: `Hình ảnh chứa nội dung không phù hợp: ${moderationResult.rejectedCategories.join(
							', ',
					  )}`,
			});
		} catch (error) {
			console.error('Image moderation error:', error);
			res.status(500).json({
				success: false,
				message: 'Lỗi kiểm duyệt hình ảnh',
				error: error.message,
			});
		}
	};

	/**
	 * Kiểm tra nhiều hình ảnh cùng lúc
	 */
	checkMultipleImages = async (req, res) => {
		try {
			if (!req.files || req.files.length === 0) {
				return res.status(400).json({
					success: false,
					message: 'Vui lòng cung cấp ít nhất một hình ảnh',
				});
			}

			// Giới hạn số lượng hình ảnh
			if (req.files.length > 10) {
				return res.status(400).json({
					success: false,
					message: 'Tối đa 10 hình ảnh mỗi lần kiểm tra',
				});
			}

			const promises = req.files.map(async (file, index) => {
				try {
					// Kiểm tra kích thước và định dạng
					if (file.size > 10 * 1024 * 1024) {
						return {
							filename: file.originalname,
							success: false,
							isAppropriate: false,
							error: 'Kích thước file quá lớn (>10MB)',
						};
					}

					const allowedTypes = [
						'image/jpeg',
						'image/jpg',
						'image/png',
						'image/webp',
					];
					if (!allowedTypes.includes(file.mimetype)) {
						return {
							filename: file.originalname,
							success: false,
							isAppropriate: false,
							error: 'Định dạng file không được hỗ trợ',
						};
					}

					const [result] =
						await this.visionClient.safeSearchDetection({
							image: { content: file.buffer },
						});

					const detections = result.safeSearchAnnotation;
					const moderationResult =
						this.analyzeModerationResult(detections);

					return {
						filename: file.originalname,
						success: true,
						...moderationResult,
					};
				} catch (error) {
					return {
						filename: file.originalname,
						success: false,
						isAppropriate: false,
						error: error.message,
					};
				}
			});

			const results = await Promise.all(promises);

			res.json({
				success: true,
				results,
				totalImages: results.length,
				appropriateImages: results.filter(
					(r) => r.isAppropriate && !r.error,
				).length,
				inappropriateImages: results.filter(
					(r) => !r.isAppropriate && !r.error,
				).length,
				errorImages: results.filter((r) => r.error).length,
			});
		} catch (error) {
			console.error('Multiple image moderation error:', error);
			res.status(500).json({
				success: false,
				message: 'Lỗi kiểm duyệt nhiều hình ảnh',
				error: error.message,
			});
		}
	};

	/**
	 * Phân tích kết quả kiểm duyệt với logic tùy chỉnh cho e-commerce
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

		// Áp dụng logic override cho e-commerce trước khi kiểm tra ngưỡng
		const overrideResult = this.applyEcommerceOverrides(detections);
		if (overrideResult) {
			return overrideResult;
		}

		categories.forEach((cat) => {
			const threshold = this.moderationConfig.thresholds[cat.name];
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

		const isAppropriate = rejectedCategories.length === 0; // Phù hợp nếu không có hình ảnh nào bị từ chối
		const confidence = this.calculateConfidence(detections); // Độ tin cậy của kết quả
		const riskLevel = this.calculateRiskLevel(
			rejectedCategories,
			warnedCategories,
			confidence,
		); // Mức độ rủi ro của kết quả

		return {
			isAppropriate,
			confidence,
			riskLevel,
			categories,
			rejectedCategories,
			warnedCategories,
			moderationConfig: this.moderationConfig,
		};
	}

	/**
	 * Áp dụng logic override đặc biệt cho e-commerce
	 */
	applyEcommerceOverrides(detections) {
		// Trường hợp 1: Vũ khí thật - từ chối nghiêm ngặt
		if (
			this.isLikelihoodHigher(detections.violence, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.spoof, 'UNLIKELY')
		) {
			console.log('Override: Real weapons detected - strict rejection');
			return {
				isAppropriate: false,
				confidence: 90,
				riskLevel: 'HIGH',
				categories: [
					{ name: 'adult', likelihood: detections.adult },
					{ name: 'violence', likelihood: detections.violence },
					{ name: 'racy', likelihood: detections.racy },
					{ name: 'spoof', likelihood: detections.spoof },
					{ name: 'medical', likelihood: detections.medical },
					{ name: 'hate', likelihood: detections.hate },
					{ name: 'terror', likelihood: detections.terror },
				],
				rejectedCategories: ['violence'],
				warnedCategories: [],
				moderationConfig: this.moderationConfig,
				overrideReason:
					'Vũ khí thật được phát hiện - không được phép bán',
			};
		}

		// Trường hợp 2: Vũ khí đồ chơi - cho phép với cảnh báo (nghiêm ngặt hơn)
		if (
			this.isLikelihoodHigher(detections.violence, 'UNLIKELY') &&
			this.isLikelihoodHigher(detections.spoof, 'UNLIKELY') &&
			this.moderationConfig.ecommerceSettings.allowToyWeapons
		) {
			console.log('Override: Toy weapons detected - allow with warning');
			return {
				isAppropriate: true,
				confidence: 70,
				riskLevel: 'MEDIUM',
				categories: [
					{ name: 'adult', likelihood: detections.adult },
					{ name: 'violence', likelihood: detections.violence },
					{ name: 'racy', likelihood: detections.racy },
					{ name: 'spoof', likelihood: detections.spoof },
					{ name: 'medical', likelihood: detections.medical },
					{ name: 'hate', likelihood: detections.hate },
					{ name: 'terror', likelihood: detections.terror },
				],
				rejectedCategories: [],
				warnedCategories: ['violence'],
				moderationConfig: this.moderationConfig,
				overrideReason: 'Vũ khí đồ chơi - cần kiểm tra độ tuổi phù hợp',
			};
		}

		// Trường hợp 3: Sản phẩm y tế hợp pháp (nghiêm ngặt hơn)
		if (
			this.isLikelihoodHigher(detections.medical, 'UNLIKELY') &&
			!this.isLikelihoodHigher(detections.medical, 'POSSIBLE') &&
			this.moderationConfig.ecommerceSettings.allowMedicalProducts
		) {
			console.log(
				'Override: Legal medical products detected - allow with review',
			);
			return {
				isAppropriate: true,
				confidence: 65,
				riskLevel: 'MEDIUM',
				categories: [
					{ name: 'adult', likelihood: detections.adult },
					{ name: 'violence', likelihood: detections.violence },
					{ name: 'racy', likelihood: detections.racy },
					{ name: 'spoof', likelihood: detections.spoof },
					{ name: 'medical', likelihood: detections.medical },
					{ name: 'hate', likelihood: detections.hate },
					{ name: 'terror', likelihood: detections.terror },
				],
				rejectedCategories: [],
				warnedCategories: ['medical'],
				moderationConfig: this.moderationConfig,
				overrideReason: 'Sản phẩm y tế - cần kiểm tra giấy phép',
			};
		}

		// Trường hợp 4: Hình ảnh người mẫu (quần áo, trang sức) - cho phép (nghiêm ngặt hơn)
		if (
			(this.isLikelihoodHigher(detections.adult, 'VERY_UNLIKELY') ||
				this.isLikelihoodHigher(detections.racy, 'VERY_UNLIKELY')) &&
			!this.isLikelihoodHigher(detections.violence, 'UNLIKELY') &&
			this.moderationConfig.ecommerceSettings.allowModelImages
		) {
			console.log(
				'Override: Model images detected - allow for fashion products',
			);
			return {
				isAppropriate: true,
				confidence: 80,
				riskLevel: 'LOW',
				categories: [
					{ name: 'adult', likelihood: detections.adult },
					{ name: 'violence', likelihood: detections.violence },
					{ name: 'racy', likelihood: detections.racy },
					{ name: 'spoof', likelihood: detections.spoof },
					{ name: 'medical', likelihood: detections.medical },
					{ name: 'hate', likelihood: detections.hate },
					{ name: 'terror', likelihood: detections.terror },
				],
				rejectedCategories: [],
				warnedCategories: [],
				moderationConfig: this.moderationConfig,
				overrideReason:
					'Hình ảnh người mẫu - phù hợp cho sản phẩm thời trang',
			};
		}

		// Trường hợp 5: Thiết bị gia dụng - cho phép (thêm logic mới)
		if (
			// Kiểm tra nếu có medical content nhẹ và không có nội dung nguy hiểm khác
			this.isLikelihoodHigher(detections.medical, 'UNLIKELY') &&
			!this.isLikelihoodHigher(detections.medical, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.violence, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.adult, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.racy, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.hate, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.terror, 'POSSIBLE') &&
			this.moderationConfig.ecommerceSettings.allowHouseholdAppliances
		) {
			console.log('Override: Household appliances detected - allow');
			return {
				isAppropriate: true,
				confidence: 85,
				riskLevel: 'LOW',
				categories: [
					{ name: 'adult', likelihood: detections.adult },
					{ name: 'violence', likelihood: detections.violence },
					{ name: 'racy', likelihood: detections.racy },
					{ name: 'spoof', likelihood: detections.spoof },
					{ name: 'medical', likelihood: detections.medical },
					{ name: 'hate', likelihood: detections.hate },
					{ name: 'terror', likelihood: detections.terror },
				],
				rejectedCategories: [],
				warnedCategories: [],
				moderationConfig: this.moderationConfig,
				overrideReason: 'Thiết bị gia dụng - phù hợp cho e-commerce',
			};
		}

		// Trường hợp 6: Điện thoại và thiết bị điện tử - cho phép (thêm logic mới)
		if (
			// Kiểm tra nếu có racy content nhẹ và không có nội dung nguy hiểm khác
			this.isLikelihoodHigher(detections.racy, 'UNLIKELY') &&
			!this.isLikelihoodHigher(detections.racy, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.adult, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.violence, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.hate, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.terror, 'POSSIBLE') &&
			this.moderationConfig.ecommerceSettings.allowElectronics
		) {
			console.log('Override: Electronics/phones detected - allow');
			return {
				isAppropriate: true,
				confidence: 90,
				riskLevel: 'LOW',
				categories: [
					{ name: 'adult', likelihood: detections.adult },
					{ name: 'violence', likelihood: detections.violence },
					{ name: 'racy', likelihood: detections.racy },
					{ name: 'spoof', likelihood: detections.spoof },
					{ name: 'medical', likelihood: detections.medical },
					{ name: 'hate', likelihood: detections.hate },
					{ name: 'terror', likelihood: detections.terror },
				],
				rejectedCategories: [],
				warnedCategories: [],
				moderationConfig: this.moderationConfig,
				overrideReason:
					'Điện thoại và thiết bị điện tử - phù hợp cho e-commerce',
			};
		}

		// Trường hợp 7: Thiết bị có thể bị nhận diện sai là violence - cho phép
		if (
			// Kiểm tra nếu có violence content nhẹ và không có nội dung nguy hiểm khác
			this.isLikelihoodHigher(detections.violence, 'UNLIKELY') &&
			!this.isLikelihoodHigher(detections.violence, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.adult, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.racy, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.hate, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.terror, 'POSSIBLE') &&
			this.moderationConfig.ecommerceSettings.allowHouseholdAppliances
		) {
			console.log('Override: Safe household items detected - allow');
			return {
				isAppropriate: true,
				confidence: 80,
				riskLevel: 'LOW',
				categories: [
					{ name: 'adult', likelihood: detections.adult },
					{ name: 'violence', likelihood: detections.violence },
					{ name: 'racy', likelihood: detections.racy },
					{ name: 'spoof', likelihood: detections.spoof },
					{ name: 'medical', likelihood: detections.medical },
					{ name: 'hate', likelihood: detections.hate },
					{ name: 'terror', likelihood: detections.terror },
				],
				rejectedCategories: [],
				warnedCategories: [],
				moderationConfig: this.moderationConfig,
				overrideReason:
					'Thiết bị gia dụng an toàn - phù hợp cho e-commerce',
			};
		}

		// Trường hợp 8: Sản phẩm điện tử với adult content nhẹ - cho phép
		if (
			// Kiểm tra nếu có adult content nhẹ và không có nội dung nguy hiểm khác
			this.isLikelihoodHigher(detections.adult, 'UNLIKELY') &&
			!this.isLikelihoodHigher(detections.adult, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.violence, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.hate, 'POSSIBLE') &&
			!this.isLikelihoodHigher(detections.terror, 'POSSIBLE') &&
			this.moderationConfig.ecommerceSettings.allowElectronics
		) {
			console.log(
				'Override: Electronics with mild adult content - allow',
			);
			return {
				isAppropriate: true,
				confidence: 85,
				riskLevel: 'LOW',
				categories: [
					{ name: 'adult', likelihood: detections.adult },
					{ name: 'violence', likelihood: detections.violence },
					{ name: 'racy', likelihood: detections.racy },
					{ name: 'spoof', likelihood: detections.spoof },
					{ name: 'medical', likelihood: detections.medical },
					{ name: 'hate', likelihood: detections.hate },
					{ name: 'terror', likelihood: detections.terror },
				],
				rejectedCategories: [],
				warnedCategories: [],
				moderationConfig: this.moderationConfig,
				overrideReason:
					'Sản phẩm điện tử với nội dung nhẹ - phù hợp cho e-commerce',
			};
		}

		// Trường hợp 9: Nội dung thù địch hoặc khủng bố - từ chối nghiêm ngặt
		if (
			this.isLikelihoodHigher(detections.hate, 'VERY_UNLIKELY') ||
			this.isLikelihoodHigher(detections.terror, 'VERY_UNLIKELY')
		) {
			console.log(
				'Override: Hate/terror content detected - strict rejection',
			);
			return {
				isAppropriate: false,
				confidence: 95,
				riskLevel: 'HIGH',
				categories: [
					{ name: 'adult', likelihood: detections.adult },
					{ name: 'violence', likelihood: detections.violence },
					{ name: 'racy', likelihood: detections.racy },
					{ name: 'spoof', likelihood: detections.spoof },
					{ name: 'medical', likelihood: detections.medical },
					{ name: 'hate', likelihood: detections.hate },
					{ name: 'terror', likelihood: detections.terror },
				],
				rejectedCategories: [
					...(this.isLikelihoodHigher(
						detections.hate,
						'VERY_UNLIKELY',
					)
						? ['hate']
						: []),
					...(this.isLikelihoodHigher(
						detections.terror,
						'VERY_UNLIKELY',
					)
						? ['terror']
						: []),
				],
				warnedCategories: [],
				moderationConfig: this.moderationConfig,
				overrideReason:
					'Nội dung thù địch/khủng bố - không được phép bán',
			};
		}

		return null; // Không có override
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
		return levels.indexOf(likelihood) >= levels.indexOf(threshold); // Trả về true nếu likelihood cao hơn threshold
	}

	/**
	 * Tính độ tin cậy của kết quả
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

		// Kiểm tra xem có likelihood nào không hợp lệ không
		const validCategories = categories.filter(
			(likelihood) =>
				likelihood &&
				Object.prototype.hasOwnProperty.call(
					likelihoodScores,
					likelihood,
				),
		);

		if (validCategories.length === 0) {
			console.warn(
				'No valid likelihood values found in detections:',
				detections,
			);
			return 50; // Giá trị mặc định
		}

		const averageScore =
			validCategories.reduce((sum, likelihood) => {
				return sum + (likelihoodScores[likelihood] || 0);
			}, 0) / validCategories.length;

		return Math.round((1 - averageScore) * 100); // Confidence cao nếu ít rủi ro
	}

	/**
	 * Tính mức độ rủi ro
	 */
	calculateRiskLevel(rejectedCategories, warnedCategories, confidence) {
		if (rejectedCategories.length > 0) {
			return 'HIGH';
		} else if (
			warnedCategories.length > 0 ||
			confidence < this.moderationConfig.confidenceThreshold
		) {
			return 'MEDIUM';
		} else {
			return 'LOW';
		}
	}

	/**
	 * Middleware để tích hợp kiểm duyệt vào quy trình upload sản phẩm
	 */
	moderateProductImages = async (req, res, next) => {
		if (!this.moderationConfig.enabled) {
			return next();
		}

		try {
			const files = req.files || (req.file ? [req.file] : []);
			if (files.length === 0) {
				return next();
			}

			const moderationResults = [];

			for (const file of files) {
				const [result] = await this.visionClient.safeSearchDetection({
					image: { content: file.buffer },
				});

				const detections = result.safeSearchAnnotation;
				const moderationResult =
					this.analyzeModerationResult(detections);

				moderationResults.push({
					filename: file.originalname,
					...moderationResult,
				});
			}

			// Kiểm tra xem có hình ảnh nào bị từ chối không
			const hasRejectedImages = moderationResults.some(
				(result) => !result.isAppropriate,
			);

			if (hasRejectedImages && this.moderationConfig.autoReject) {
				return res.status(400).json({
					success: false,
					message: 'Một số hình ảnh không đạt tiêu chuẩn kiểm duyệt',
					moderationResults,
				});
			}

			// Lưu kết quả kiểm duyệt vào request
			req.moderationResults = moderationResults;
			next();
		} catch (error) {
			console.error('Product image moderation error:', error);
			if (this.moderationConfig.strictMode) {
				return res.status(500).json({
					success: false,
					message: 'Lỗi kiểm duyệt hình ảnh sản phẩm',
				});
			}
			next();
		}
	};

	/**
	 * Lấy thống kê kiểm duyệt từ database
	 */
	getModerationStats = async (req, res) => {
		try {
			const stats = await ImageModerationModel.getStats();

			res.json({
				success: true,
				stats: {
					...stats,
					riskLevelDistribution: {
						LOW: stats.lowRiskCount || 0,
						MEDIUM: stats.mediumRiskCount || 0,
						HIGH: stats.highRiskCount || 0,
					},
				},
				config: this.moderationConfig,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Lỗi lấy thống kê',
				error: error.message,
			});
		}
	};

	/**
	 * Cập nhật cấu hình kiểm duyệt
	 */
	updateModerationConfig = async (req, res) => {
		try {
			const {
				enabled,
				strictMode,
				autoReject,
				confidenceThreshold,
				thresholds,
			} = req.body;

			// TODO: Lưu cấu hình vào database

			res.json({
				success: true,
				message: 'Cập nhật cấu hình thành công',
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Lỗi cập nhật cấu hình',
				error: error.message,
			});
		}
	};

	/**
	 * Lấy lịch sử kiểm duyệt của user
	 */
	getModerationHistory = async (req, res) => {
		try {
			const { page = 1, limit = 10, status, riskLevel } = req.query;
			const userId = req.user.id;

			const query = { userId, _destroy: { $ne: true } };

			if (status) query.status = status;
			if (riskLevel) query.riskLevel = riskLevel;

			const options = {
				page: parseInt(page),
				limit: parseInt(limit),
				sort: { createdAt: -1 },
				populate: [
					{ path: 'productId', select: 'title slug' },
					{ path: 'reviewedBy', select: 'username email' },
				],
			};

			const history = await ImageModerationModel.paginate(query, options);

			res.json({
				success: true,
				history,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Lỗi lấy lịch sử kiểm duyệt',
				error: error.message,
			});
		}
	};

	/**
	 * Lấy danh sách hình ảnh cần review thủ công
	 */
	getPendingReviews = async (req, res) => {
		try {
			const { page = 1, limit = 20, riskLevel } = req.query;

			const query = {
				status: 'MANUAL_REVIEW',
				_destroy: { $ne: true },
			};

			if (riskLevel) query.riskLevel = riskLevel;

			const options = {
				page: parseInt(page),
				limit: parseInt(limit),
				sort: { createdAt: -1 },
				populate: [
					{ path: 'userId', select: 'username email' },
					{ path: 'productId', select: 'title slug' },
				],
			};

			const pendingReviews = await ImageModerationModel.paginate(
				query,
				options,
			);

			res.json({
				success: true,
				pendingReviews,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Lỗi lấy danh sách review',
				error: error.message,
			});
		}
	};

	/**
	 * Review thủ công một hình ảnh
	 */
	reviewImage = async (req, res) => {
		try {
			const { id } = req.params;
			const { action, note } = req.body; // action: 'approve', 'reject'
			const reviewerId = req.user.id;

			const imageModeration = await ImageModerationModel.findById(id);

			if (!imageModeration) {
				return res.status(404).json({
					success: false,
					message: 'Không tìm thấy hình ảnh cần review',
				});
			}

			if (action === 'approve') {
				await imageModeration.approve(reviewerId, note);
			} else if (action === 'reject') {
				await imageModeration.reject(reviewerId, note);
			} else {
				return res.status(400).json({
					success: false,
					message: 'Hành động không hợp lệ',
				});
			}

			res.json({
				success: true,
				message: `Đã ${
					action === 'approve' ? 'phê duyệt' : 'từ chối'
				} hình ảnh`,
				imageModeration,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Lỗi review hình ảnh',
				error: error.message,
			});
		}
	};
}

export default new ImageModerationController();
