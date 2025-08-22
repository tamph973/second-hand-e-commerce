import axios from 'axios';

// Utility functions for verification processes

/**
 * Xác minh CCCD bằng AI (OCR + Face Recognition)
 * @param {Object} cccdData - Dữ liệu CCCD
 * @returns {Promise<Object>} Kết quả xác minh
 */
export const verifyCCCDWithAI = async (cccdData) => {
	try {
		// TODO: Tích hợp với AI service (Google Vision API, AWS Rekognition, etc.)
		// const result = await aiService.verifyCCCD(cccdData);

		// Mock validation logic
		const validationResult = {
			isValid: true,
			confidence: 0.95,
			extractedData: {
				fullName: cccdData.fullName || 'Nguyễn Văn A',
				cccdNumber: cccdData.cccdNumber,
				dateOfBirth: '1990-01-01',
				address: 'Hà Nội',
			},
			faceMatch: true,
			faceConfidence: 0.92,
			ocrConfidence: 0.95,
			imageQuality: 'GOOD',
			verificationSteps: {
				ocrExtraction: true,
				numberValidation: true,
				faceDetection: true,
				documentAuthenticity: true,
				imageQualityCheck: true,
			},
		};

		// Simulate AI processing time
		await new Promise((resolve) => setTimeout(resolve, 2000));

		return validationResult;
	} catch (error) {
		console.error('Error verifying CCCD with AI:', error);
		return {
			isValid: false,
			confidence: 0,
			error: error.message,
			verificationSteps: {
				ocrExtraction: false,
				numberValidation: false,
				faceDetection: false,
				documentAuthenticity: false,
				imageQualityCheck: false,
			},
		};
	}
};

/**
 * Xác minh tài khoản ngân hàng
 * @param {Object} bankData - Dữ liệu tài khoản ngân hàng
 * @returns {Promise<Object>} Kết quả xác minh
 */
export const verifyBankAccountAPI = async (bankData) => {
	try {
		// TODO: Tích hợp với API ngân hàng hoặc service bên thứ 3
		// const result = await bankAPI.verifyAccount(bankData);

		// Tạm thời return mock data
		return {
			isValid: true,
			accountName: bankData.accountName,
			bankName: bankData.bankName,
			accountType: 'Cá nhân',
			status: 'Hoạt động',
		};
	} catch (error) {
		console.error('Error verifying bank account:', error);
		return {
			isValid: false,
			error: error.message,
		};
	}
};

/**
 * Xác minh số điện thoại qua SMS
 * @param {string} phoneNumber - Số điện thoại
 * @returns {Promise<Object>} Kết quả xác minh
 */
export const verifyPhoneNumber = async (phoneNumber) => {
	try {
		// TODO: Tích hợp với SMS service (Vonage, Twilio, Nexmo, etc.)
		// const result = await smsService.sendVerificationCode(phoneNumber);

		return {
			isValid: true,
			carrier: 'Viettel',
			country: 'VN',
		};
		// eslint-disable-next-line no-unreachable
	} catch (error) {
		console.error('Error verifying phone number:', error);
		return {
			isValid: false,
			error: error.message,
		};
	}
};

/**
 * Xác minh email
 * @param {string} email - Email address
 * @returns {Promise<Object>} Kết quả xác minh
 */
export const verifyEmail = async (email) => {
	try {
		// TODO: Tích hợp với email verification service
		// const result = await emailService.verifyEmail(email);

		return {
			isValid: true,
			domain: email.split('@')[1],
			disposable: false,
		};
	} catch (error) {
		console.error('Error verifying email:', error);
		return {
			isValid: false,
			error: error.message,
		};
	}
};

/**
 * Tính toán điểm tín nhiệm của seller
 * @param {Object} sellerData - Dữ liệu seller
 * @returns {number} Điểm tín nhiệm (0-100)
 */
export const calculateTrustScore = (sellerData) => {
	let score = 0;
	const { sellerVerification } = sellerData;

	// Điểm cơ bản cho việc xác minh
	if (sellerVerification.isVerified) score += 20;
	if (sellerVerification.cccdVerified) score += 25;
	if (sellerVerification.bankAccount.verified) score += 20;
	if (sellerVerification.isEmailVerified) score += 10;
	if (sellerVerification.isPhoneVerified) score += 10;

	// Điểm cho cấp độ xác minh
	const levelScores = {
		NONE: 0,
		BASIC: 5,
		ADVANCED: 10,
		PREMIUM: 15,
	};
	score += levelScores[sellerVerification.verificationLevel] || 0;

	// Điểm cho metrics
	const { metrics } = sellerVerification;
	if (metrics.rating >= 4.5) score += 10;
	else if (metrics.rating >= 4.0) score += 5;

	if (metrics.responseRate >= 90) score += 5;
	else if (metrics.responseRate >= 80) score += 3;

	if (metrics.totalSales > 10000000) score += 5; // > 10M VND

	// Giới hạn điểm tối đa
	return Math.min(score, 100);
};

/**
 * Kiểm tra xem seller có đủ điều kiện để đăng sản phẩm giá cao không
 * @param {Object} sellerData - Dữ liệu seller
 * @param {number} price - Giá sản phẩm
 * @returns {boolean}
 */
export const canSellHighValueProduct = (sellerData, price) => {
	const trustScore = calculateTrustScore(sellerData);
	const { sellerVerification } = sellerData;

	// Sản phẩm giá cao (> 5M VNĐ) yêu cầu trust score cao
	if (price > 5000000) {
		return (
			trustScore >= 70 &&
			sellerVerification.verificationLevel === 'PREMIUM'
		);
	}

	// Sản phẩm giá trung bình (1M-5M VNĐ)
	if (price > 1000000) {
		return (
			trustScore >= 50 && sellerVerification.verificationLevel !== 'NONE'
		);
	}

	// Sản phẩm giá thấp (< 1M VNĐ)
	return sellerVerification.isVerified;
};

/**
 * Tạo báo cáo xác minh cho admin
 * @param {Object} sellerData - Dữ liệu seller
 * @returns {Object} Báo cáo xác minh
 */
export const generateVerificationReport = (sellerData) => {
	const { sellerVerification } = sellerData;
	const trustScore = calculateTrustScore(sellerData);

	return {
		sellerId: sellerData._id,
		fullName: sellerData.fullName,
		email: sellerData.email,
		phoneNumber: sellerData.phoneNumber,
		verificationStatus: {
			isVerified: sellerVerification.isVerified,
			level: sellerVerification.verificationLevel,
			trustScore,
			verificationDate: sellerVerification.verificationDate,
		},
		verificationDetails: {
			cccdVerified: sellerVerification.cccdVerified,
			bankVerified: sellerVerification.bankAccount.verified,
			emailVerified: sellerData.isEmailVerified,
			phoneVerified: sellerData.isPhoneVerified,
		},
		metrics: sellerVerification.metrics,
		limits: sellerVerification.limits,
		recommendations: generateRecommendations(sellerData, trustScore),
	};
};

/**
 * Tạo khuyến nghị cho seller
 * @param {Object} sellerData - Dữ liệu seller
 * @param {number} trustScore - Điểm tín nhiệm
 * @returns {Array} Danh sách khuyến nghị
 */
const generateRecommendations = (sellerData, trustScore) => {
	const recommendations = [];
	const { sellerVerification } = sellerData;

	if (!sellerVerification.cccdVerified) {
		recommendations.push('Xác minh CCCD để tăng độ tin cậy');
	}

	if (!sellerVerification.bankAccount.verified) {
		recommendations.push('Xác minh tài khoản ngân hàng để nâng cấp cấp độ');
	}

	if (trustScore < 50) {
		recommendations.push(
			'Cải thiện điểm tín nhiệm bằng cách tăng cường xác minh',
		);
	}

	if (sellerVerification.metrics.rating < 4.0) {
		recommendations.push('Cải thiện đánh giá từ người mua');
	}

	if (sellerVerification.metrics.responseRate < 80) {
		recommendations.push('Tăng tỷ lệ phản hồi khách hàng');
	}

	return recommendations;
};

// OTP Countdown Management
const OTP_EXPIRY_TIME = 2 * 60; // 2 minutes in seconds
const OTP_MAX_ATTEMPTS = 3; // Maximum attempts per email

// Store OTP attempts in memory (in production, use Redis)
const otpAttempts = new Map();

/**
 * Generate OTP with server-side countdown tracking
 * @param {string} email - User email
 * @returns {Object} OTP data with expiry
 */
export const generateOTPWithCountdown = (email) => {
	const now = Date.now();
	const otp = generateOTP();

	// Store OTP data with timestamp
	const otpData = {
		otp,
		createdAt: now,
		expiresAt: now + OTP_EXPIRY_TIME * 1000,
		attempts: 0,
		email,
	};

	// Store in memory (use Redis in production)
	otpAttempts.set(email, otpData);

	return {
		otp,
		expiresIn: OTP_EXPIRY_TIME,
		attempts: 0,
	};
};

/**
 * Verify OTP with countdown validation
 * @param {string} email - User email
 * @param {string} otp - OTP to verify
 * @returns {Object} Verification result
 */
export const verifyOTPWithCountdown = (email, otp) => {
	const otpData = otpAttempts.get(email);

	if (!otpData) {
		return {
			success: false,
			message: 'OTP không tồn tại hoặc đã hết hạn',
			code: 'OTP_NOT_FOUND',
		};
	}

	// Check if OTP is expired
	const now = Date.now();
	if (now > otpData.expiresAt) {
		otpAttempts.delete(email);
		return {
			success: false,
			message: 'OTP đã hết hạn',
			code: 'OTP_EXPIRED',
		};
	}

	// Check attempts limit
	if (otpData.attempts >= OTP_MAX_ATTEMPTS) {
		otpAttempts.delete(email);
		return {
			success: false,
			message: 'Đã vượt quá số lần thử OTP',
			code: 'OTP_MAX_ATTEMPTS',
		};
	}

	// Increment attempts
	otpData.attempts++;

	// Verify OTP
	if (otpData.otp === otp) {
		// Clear OTP after successful verification
		otpAttempts.delete(email);
		return {
			success: true,
			message: 'Xác thực OTP thành công',
			code: 'OTP_SUCCESS',
		};
	} else {
		// Update attempts count
		otpAttempts.set(email, otpData);
		return {
			success: false,
			message: 'OTP không đúng',
			code: 'OTP_INVALID',
		};
	}
};

/**
 * Get remaining time for OTP
 * @param {string} email - User email
 * @returns {Object} Remaining time info
 */
export const getOTPRemainingTime = (email) => {
	const otpData = otpAttempts.get(email);

	if (!otpData) {
		return {
			hasOTP: false,
			remainingTime: 0,
			attempts: 0,
		};
	}

	const now = Date.now();
	const remainingTime = Math.max(
		0,
		Math.floor((otpData.expiresAt - now) / 1000),
	);

	return {
		hasOTP: remainingTime > 0,
		remainingTime,
		attempts: otpData.attempts,
		maxAttempts: OTP_MAX_ATTEMPTS,
	};
};

/**
 * Clear OTP for email
 * @param {string} email - User email
 */
export const clearOTP = (email) => {
	otpAttempts.delete(email);
};

/**
 * Clean up expired OTPs (call this periodically)
 */
export const cleanupExpiredOTPs = () => {
	const now = Date.now();
	for (const [email, otpData] of otpAttempts.entries()) {
		if (now > otpData.expiresAt) {
			otpAttempts.delete(email);
		}
	}
};
