import axiosConfig from '@/configs/axiosConfig';

class ImageModerationService {
	/**
	 * Kiểm tra hình ảnh có nội dung không phù hợp
	 * @param {File|string} image - File hình ảnh hoặc URL
	 * @returns {Promise<Object>} Kết quả kiểm duyệt
	 */
	async moderateImage(image) {
		try {
			const formData = new FormData();

			if (image instanceof File) {
				formData.append('image', image);
			} else if (typeof image === 'string') {
				formData.append('imageUrl', image);
			}

			const response = await axiosConfig.post(
				`/image-moderation/check`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);

			return {
				success: true,
				data: response.data,
				isAppropriate: response.data.isAppropriate,
				confidence: response.data.confidence,
				riskLevel: response.data.riskLevel,
				categories: response.data.categories || [],
				rejectedCategories: response.data.rejectedCategories || [],
				warnedCategories: response.data.warnedCategories || [],
			};
		} catch (error) {
			console.error('Image moderation error:', error);
			return {
				success: false,
				error:
					error.response?.data?.message ||
					'Kiểm duyệt hình ảnh thất bại',
				isAppropriate: false, // Fail safe - reject if error
			};
		}
	}

	/**
	 * Kiểm tra nhiều hình ảnh cùng lúc
	 * @param {File[]} images - Mảng các file hình ảnh
	 * @returns {Promise<Object[]>} Kết quả kiểm duyệt cho từng hình
	 */
	async moderateMultipleImages(images) {
		try {
			const formData = new FormData();
			images.forEach((image) => {
				formData.append('images', image);
			});

			const response = await axiosConfig.post(
				`/image-moderation/check-multiple`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);

			return response.data.results.map((result, index) => ({
				index,
				filename: images[index].name,
				success: true, // Đảm bảo có trường success
				...result,
			}));
		} catch (error) {
			console.error('Multiple images moderation error:', error);
			// Fallback to individual checks if batch fails
			const results = [];
			for (let i = 0; i < images.length; i++) {
				const result = await this.moderateImage(images[i]);
				results.push({
					index: i,
					filename: images[i].name,
					...result,
				});
			}
			return results;
		}
	}

	/**
	 * Kiểm tra hình ảnh sản phẩm (tích hợp với product upload)
	 * @param {File[]} images - Mảng các file hình ảnh sản phẩm
	 * @returns {Promise<Object>} Kết quả kiểm duyệt
	 */
	async moderateProductImages(images) {
		try {
			const formData = new FormData();
			images.forEach((image) => {
				formData.append('images', image);
			});

			const response = await axiosConfig.post(
				`/image-moderation/check-product-images`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);

			return {
				success: true,
				message: response.data.message,
				moderationResults: response.data.moderationResults,
			};
		} catch (error) {
			console.error('Product images moderation error:', error);
			return {
				success: false,
				error:
					error.response?.data?.message ||
					'Kiểm duyệt hình ảnh sản phẩm thất bại',
				moderationResults: [],
			};
		}
	}

	/**
	 * Kiểm tra nhanh - chỉ trả về true/false
	 * @param {File} image - File hình ảnh
	 * @returns {Promise<boolean>} true nếu hình ảnh phù hợp
	 */
	async isImageAppropriate(image) {
		const result = await this.moderateImage(image);
		return result.success && result.isAppropriate;
	}

	/**
	 * Lấy thống kê kiểm duyệt (chỉ admin)
	 * @returns {Promise<Object>} Thống kê kiểm duyệt
	 */
	async getModerationStats() {
		try {
			const response = await axiosConfig.get('/image-moderation/stats');
			return {
				success: true,
				data: response.data,
			};
		} catch (error) {
			console.error('Get moderation stats error:', error);
			return {
				success: false,
				error: error.response?.data?.message || 'Lấy thống kê thất bại',
			};
		}
	}

	/**
	 * Lấy lịch sử kiểm duyệt của user
	 * @param {Object} params - Tham số query (page, limit, status, etc.)
	 * @returns {Promise<Object>} Lịch sử kiểm duyệt
	 */
	async getModerationHistory(params = {}) {
		try {
			const response = await axiosConfig.get(
				'/image-moderation/history',
				{
					params,
				},
			);
			return {
				success: true,
				data: response.data,
			};
		} catch (error) {
			console.error('Get moderation history error:', error);
			return {
				success: false,
				error: error.response?.data?.message || 'Lấy lịch sử thất bại',
			};
		}
	}

	/**
	 * Lấy danh sách hình ảnh cần review thủ công (chỉ admin)
	 * @param {Object} params - Tham số query (page, limit, riskLevel, etc.)
	 * @returns {Promise<Object>} Danh sách cần review
	 */
	async getPendingReviews(params = {}) {
		try {
			const response = await axiosConfig.get(
				'/image-moderation/pending-reviews',
				{
					params,
				},
			);
			return {
				success: true,
				data: response.data,
			};
		} catch (error) {
			console.error('Get pending reviews error:', error);
			return {
				success: false,
				error:
					error.response?.data?.message ||
					'Lấy danh sách review thất bại',
			};
		}
	}

	/**
	 * Review thủ công một hình ảnh (chỉ admin)
	 * @param {string} moderationId - ID của moderation record
	 * @param {Object} reviewData - Dữ liệu review (status, reviewNote)
	 * @returns {Promise<Object>} Kết quả review
	 */
	async reviewImage(moderationId, reviewData) {
		try {
			const response = await axiosConfig.put(
				`/image-moderation/${moderationId}/review`,
				reviewData,
			);
			return {
				success: true,
				data: response.data,
			};
		} catch (error) {
			console.error('Review image error:', error);
			return {
				success: false,
				error: error.response?.data?.message || 'Review thất bại',
			};
		}
	}

	/**
	 * Lấy thông tin chi tiết về nội dung không phù hợp
	 * @param {Object} moderationResult - Kết quả từ moderateImage
	 * @returns {string} Mô tả lý do từ chối
	 */
	getRejectionReason(moderationResult) {
		// Nếu có override reason, ưu tiên hiển thị
		if (moderationResult.overrideReason) {
			return moderationResult.overrideReason;
		}

		if (
			!moderationResult.rejectedCategories ||
			moderationResult.rejectedCategories.length === 0
		) {
			return 'Hình ảnh chứa nội dung không phù hợp';
		}

		const categoryNames = {
			adult: 'Nội dung người lớn',
			violence: 'Bạo lực',
			racy: 'Nội dung khiêu dâm',
			spoof: 'Nội dung giả mạo',
			medical: 'Nội dung y tế nhạy cảm',
			hate: 'Nội dung thù địch',
			terror: 'Nội dung khủng bố',
		};

		const reasons = moderationResult.rejectedCategories.map(
			(cat) => categoryNames[cat] || cat,
		);

		let reason = `Hình ảnh chứa: ${reasons.join(', ')}`;

		// Thêm thông tin override nếu có
		if (moderationResult.overrideReason) {
			reason += ` (${moderationResult.overrideReason})`;
		}

		return reason;
	}

	/**
	 * Lấy thông tin cảnh báo về nội dung
	 * @param {Object} moderationResult - Kết quả từ moderateImage
	 * @returns {string} Mô tả cảnh báo
	 */
	getWarningReason(moderationResult) {
		if (
			!moderationResult.warnedCategories ||
			moderationResult.warnedCategories.length === 0
		) {
			return null;
		}

		const categoryNames = {
			adult: 'Nội dung người lớn',
			violence: 'Bạo lực',
			racy: 'Nội dung khiêu dâm',
			spoof: 'Nội dung giả mạo',
			medical: 'Nội dung y tế nhạy cảm',
			hate: 'Nội dung thù địch',
			terror: 'Nội dung khủng bố',
		};

		const warnings = moderationResult.warnedCategories.map(
			(cat) => categoryNames[cat] || cat,
		);

		return `Cảnh báo: ${warnings.join(', ')}`;
	}

	/**
	 * Lấy màu sắc hiển thị dựa trên mức độ rủi ro
	 * @param {string} riskLevel - Mức độ rủi ro (LOW, MEDIUM, HIGH)
	 * @returns {string} Màu sắc CSS
	 */
	getRiskLevelColor(riskLevel) {
		switch (riskLevel) {
			case 'HIGH':
				return '#ef4444'; // red-500
			case 'MEDIUM':
				return '#f59e0b'; // amber-500
			case 'LOW':
				return '#10b981'; // emerald-500
			default:
				return '#6b7280'; // gray-500
		}
	}

	/**
	 * Lấy text hiển thị cho mức độ rủi ro
	 * @param {string} riskLevel - Mức độ rủi ro (LOW, MEDIUM, HIGH)
	 * @returns {string} Text hiển thị
	 */
	getRiskLevelText(riskLevel) {
		switch (riskLevel) {
			case 'HIGH':
				return 'Rủi ro cao';
			case 'MEDIUM':
				return 'Rủi ro trung bình';
			case 'LOW':
				return 'Rủi ro thấp';
			default:
				return 'Không xác định';
		}
	}

	/**
	 * Lấy thông tin override nếu có
	 * @param {Object} moderationResult - Kết quả từ moderateImage
	 * @returns {string|null} Thông tin override hoặc null
	 */
	getOverrideInfo(moderationResult) {
		return moderationResult.overrideReason || null;
	}

	/**
	 * Kiểm tra xem có phải là sản phẩm e-commerce hợp pháp không
	 * @param {Object} moderationResult - Kết quả từ moderateImage
	 * @returns {boolean} True nếu là sản phẩm e-commerce hợp pháp
	 */
	isEcommerceAppropriate(moderationResult) {
		// Nếu có override reason và chứa từ khóa cho phép
		if (moderationResult.overrideReason) {
			const allowedKeywords = [
				'đồ chơi',
				'người mẫu',
				'thời trang',
				'sản phẩm y tế',
				'giấy phép',
				'phù hợp',
			];
			return allowedKeywords.some((keyword) =>
				moderationResult.overrideReason.toLowerCase().includes(keyword),
			);
		}
		return false;
	}
}

export default new ImageModerationService();
