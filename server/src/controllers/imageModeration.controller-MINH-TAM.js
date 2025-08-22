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

			// Thêm cấu hình cho xử lý ảnh mờ
			blurDetection: {
				enabled: env.BLUR_DETECTION_ENABLED === 'true',
				threshold: parseFloat(env.BLUR_DETECTION_THRESHOLD) || 0.3, // Ngưỡng phát hiện mờ (0-1)
				action: env.BLUR_DETECTION_ACTION || 'WARN', // 'REJECT', 'WARN', 'REVIEW'
				allowSlightBlur: env.ALLOW_SLIGHT_BLUR === 'true', // Cho phép mờ nhẹ
				slightBlurThreshold:
					parseFloat(env.SLIGHT_BLUR_THRESHOLD) || 0.5,
			},

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
				requireClearProductImages: true, // Yêu cầu ảnh sản phẩm rõ nét
				allowBlurredBackgrounds: true, // Cho phép background mờ (bokeh effect)
			},
		};
	}

	/**
	 * Phát hiện ảnh mờ sử dụng Google Cloud Vision API
	 */
	detectImageBlur = async (imageBuffer) => {
		try {
			// Sử dụng Image Properties Detection để phân tích chất lượng ảnh
			const [result] = await this.visionClient.imageProperties({
				image: { content: imageBuffer },
			});

			const properties = result.imagePropertiesAnnotation;

			// Phân tích độ sắc nét dựa trên các thuộc tính ảnh
			const blurScore = this.calculateBlurScore(properties);

			return {
				isBlurred:
					blurScore > this.moderationConfig.blurDetection.threshold,
				blurScore: blurScore,
				blurLevel: this.getBlurLevel(blurScore),
				properties: properties,
			};
		} catch (error) {
			console.error('Blur detection error:', error);
			return {
				isBlurred: false,
				blurScore: 0,
				blurLevel: 'UNKNOWN',
				error: error.message,
			};
		}
	};

	/**
	 * Tính toán điểm mờ dựa trên thuộc tính ảnh
	 */
	calculateBlurScore(properties) {
		if (!properties || !properties.dominantColors) {
			return 0;
		}

		const colors = properties.dominantColors.colors;
		if (!colors || colors.length === 0) {
			return 0;
		}

		// Phân tích độ phức tạp màu sắc
		let colorComplexity = 0;
		let edgeSharpness = 0;

		// Tính độ phức tạp màu sắc
		for (const colorInfo of colors) {
			const color = colorInfo.color;
			const score = colorInfo.score || 0;
			const pixelFraction = colorInfo.pixelFraction || 0;

			// Màu sắc đơn giản hơn thường chỉ ra ảnh mờ
			colorComplexity += score * pixelFraction;
		}

		// Phân tích độ sắc nét dựa trên phân bố màu sắc
		// Ảnh mờ thường có ít màu sắc đa dạng và phân bố đều hơn
		const uniqueColors = colors.length;
		const averageScore = colorComplexity / colors.length;

		// Tính điểm mờ (0 = rõ nét, 1 = rất mờ)
		let blurScore = 0;

		// Nếu có ít màu sắc đa dạng, có thể là ảnh mờ
		if (uniqueColors < 5) {
			blurScore += 0.3;
		}

		// Nếu màu sắc phân bố quá đều, có thể là ảnh mờ
		if (averageScore > 0.8) {
			blurScore += 0.4;
		}

		// Kiểm tra độ tương phản
		const contrast = this.calculateContrast(colors);
		if (contrast < 0.3) {
			blurScore += 0.3;
		}

		return Math.min(blurScore, 1.0);
	}

	/**
	 * Tính độ tương phản của ảnh
	 */
	calculateContrast(colors) {
		if (colors.length < 2) return 0;

		let maxContrast = 0;

		for (let i = 0; i < colors.length; i++) {
			for (let j = i + 1; j < colors.length; j++) {
				const color1 = colors[i].color;
				const color2 = colors[j].color;

				// Tính khoảng cách màu sắc
				const distance = Math.sqrt(
					Math.pow(color1.red - color2.red, 2) +
						Math.pow(color1.green - color2.green, 2) +
						Math.pow(color1.blue - color2.blue, 2),
				);

				maxContrast = Math.max(maxContrast, distance / 441.67); // Chuẩn hóa về 0-1
			}
		}

		return maxContrast;
	}

	/**
	 * Xác định mức độ mờ
	 */
	getBlurLevel(blurScore) {
		if (blurScore < 0.2) return 'CLEAR';
		if (blurScore < 0.4) return 'SLIGHT_BLUR';
		if (blurScore < 0.6) return 'MODERATE_BLUR';
		if (blurScore < 0.8) return 'HEAVY_BLUR';
		return 'VERY_HEAVY_BLUR';
	}

	/**
	 * Xử lý ảnh mờ theo cấu hình
	 */
	handleBlurredImage(blurResult) {
		const config = this.moderationConfig.blurDetection;

		// Nếu cho phép mờ nhẹ và ảnh chỉ mờ nhẹ
		if (config.allowSlightBlur && blurResult.blurLevel === 'SLIGHT_BLUR') {
			return { action: 'WARN' };
		}

		// Áp dụng hành động theo cấu hình
		switch (config.action) {
			case 'REJECT':
				return { action: 'REJECT' };
			case 'REVIEW':
				return { action: 'REVIEW' };
			case 'WARN':
			default:
				return { action: 'WARN' };
		}
	}

	/**
	 * Phát hiện hiệu ứng bokeh (background mờ có chủ đích)
	 */
	detectBokehEffect(blurResult) {
		if (!blurResult.properties || !blurResult.properties.dominantColors) {
			return false;
		}

		const colors = blurResult.properties.dominantColors.colors;

		// Bokeh effect thường có:
		// 1. Màu sắc ấm áp (vàng, cam, đỏ)
		// 2. Độ sáng cao
		// 3. Phân bố màu sắc mượt mà

		let warmColorCount = 0;
		let highBrightnessCount = 0;

		for (const colorInfo of colors) {
			const color = colorInfo.color;

			// Kiểm tra màu ấm
			if (color.red > color.blue && color.green > color.blue) {
				warmColorCount++;
			}

			// Kiểm tra độ sáng cao
			const brightness = (color.red + color.green + color.blue) / 3;
			if (brightness > 200) {
				highBrightnessCount++;
			}
		}

		// Nếu có nhiều màu ấm và sáng, có thể là bokeh effect
		return warmColorCount >= 2 && highBrightnessCount >= 2;
	}

	/**
	 * Tạo thông báo kiểm duyệt với thông tin ảnh mờ
	 */
	generateModerationMessage(moderationResult, blurResult) {
		let message = '';

		if (!moderationResult.isAppropriate) {
			message = `Hình ảnh chứa nội dung không phù hợp: ${moderationResult.rejectedCategories.join(
				', ',
			)}`;
		} else {
			message = 'Hình ảnh phù hợp';
		}

		// Thêm thông tin về ảnh mờ
		if (blurResult && blurResult.isBlurred) {
			const blurMessages = {
				SLIGHT_BLUR: 'Hình ảnh hơi mờ, vui lòng chụp lại rõ nét hơn',
				MODERATE_BLUR:
					'Hình ảnh khá mờ, có thể ảnh hưởng đến chất lượng hiển thị',
				HEAVY_BLUR: 'Hình ảnh rất mờ, vui lòng chụp lại ảnh rõ nét',
				VERY_HEAVY_BLUR:
					'Hình ảnh quá mờ, không thể kiểm duyệt chính xác',
			};

			message += ` | ${
				blurMessages[blurResult.blurLevel] || 'Hình ảnh mờ'
			}`;
		}

		return message;
	}

	/**
	 * Kiểm tra hình ảnh có nội dung không phù hợp (cập nhật với blur detection)
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

			// Phát hiện ảnh mờ trước khi kiểm duyệt nội dung
			let blurResult = null;
			if (this.moderationConfig.blurDetection.enabled) {
				blurResult = await this.detectImageBlur(imageBuffer);
			}

			const [result] = await this.visionClient.safeSearchDetection({
				image: { content: imageBuffer },
			});

			const detections = result.safeSearchAnnotation;
			const moderationResult = this.analyzeModerationResult(
				detections,
				blurResult,
			);

			// Lưu kết quả kiểm duyệt vào request để sử dụng sau
			req.moderationResult = moderationResult;

			res.json({
				success: true,
				...moderationResult,
				blurDetection: blurResult,
				message: this.generateModerationMessage(
					moderationResult,
					blurResult,
				),
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
	 * Phân tích kết quả kiểm duyệt với logic tùy chỉnh cho e-commerce (cập nhật với blur detection)
	 */
	analyzeModerationResult(detections, blurResult = null) {
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

		// Xử lý ảnh mờ trước khi áp dụng logic override
		if (blurResult && blurResult.isBlurred) {
			const blurAction = this.handleBlurredImage(blurResult);
			if (blurAction.action === 'REJECT') {
				return {
					isAppropriate: false,
					confidence: 60,
					riskLevel: 'MEDIUM',
					categories,
					rejectedCategories: ['blur'],
					warnedCategories: [],
					moderationConfig: this.moderationConfig,
					blurResult,
					rejectionReason:
						'Hình ảnh quá mờ, không thể kiểm duyệt chính xác',
				};
			} else if (blurAction.action === 'REVIEW') {
				warnedCategories.push('blur');
			}
		}

		// Áp dụng logic override cho e-commerce
		const overrideResult = this.applyEcommerceOverrides(
			detections,
			blurResult,
		);
		if (overrideResult) {
			return {
				...overrideResult,
				blurResult,
			};
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

		const isAppropriate = rejectedCategories.length === 0;
		const confidence = this.calculateConfidence(detections, blurResult);
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
			moderationConfig: this.moderationConfig,
			blurResult,
		};
	}

	/**
	 * Áp dụng logic override đặc biệt cho e-commerce (cập nhật với blur detection)
	 */
	applyEcommerceOverrides(detections, blurResult = null) {
		// Trường hợp đặc biệt: Ảnh mờ với bokeh effect (background mờ)
		if (
			blurResult &&
			blurResult.blurLevel === 'MODERATE_BLUR' &&
			this.moderationConfig.ecommerceSettings.allowBlurredBackgrounds
		) {
			// Kiểm tra xem có phải là bokeh effect không
			const isBokehEffect = this.detectBokehEffect(blurResult);

			if (isBokehEffect) {
				console.log(
					'Override: Bokeh effect detected - allow with warning',
				);
				return {
					isAppropriate: true,
					confidence: 75,
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
					warnedCategories: ['blur'],
					moderationConfig: this.moderationConfig,
					overrideReason:
						'Background mờ (bokeh effect) - phù hợp cho ảnh sản phẩm',
				};
			}
		}

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
	 * Tính độ tin cậy của kết quả (cập nhật với blur detection)
	 */
	calculateConfidence(detections, blurResult = null) {
		let baseConfidence = this.calculateBaseConfidence(detections);

		// Giảm độ tin cậy nếu ảnh mờ
		if (blurResult && blurResult.isBlurred) {
			const blurPenalty = blurResult.blurScore * 20; // Giảm tối đa 20%
			baseConfidence = Math.max(baseConfidence - blurPenalty, 30);
		}

		return Math.round(baseConfidence);
	}

	/**
	 * Tính độ tin cậy cơ bản
	 */
	calculateBaseConfidence(detections) {
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
