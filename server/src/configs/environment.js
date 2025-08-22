import 'dotenv/config';

export const env = {
	// Build mode configuration
	BUILD_MODE: process.env.BUILD_MODE,

	// Server configuration
	SERVER_PORT: process.env.SERVER_PORT,
	SERVER_URL: process.env.SERVER_URL,
	FRONTEND_URL: process.env.FRONTEND_URL,

	// Database configuration
	MONGODB_URI: process.env.MONGODB_URI,

	// Redis configuration
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,

	// Mail configuration
	MAIL_ID: process.env.MAIL_ID,
	MAIL_PW: process.env.MAIL_PW,

	// Stringee configuration
	STRINGEE_API_KEY_SID: process.env.STRINGEE_API_KEY_SID,
	STRINGEE_API_KEY_SECRET: process.env.STRINGEE_API_KEY_SECRET,

	// TWILIO SMS configuration
	TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
	TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
	TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER,

	// Giao hang nhanh configuration
	GHN_TOKEN_API: process.env.GHN_TOKEN_API,
	GHN_SHOP_ID: process.env.GHN_SHOP_ID,

	// JWT configuration
	JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

	// Cloudinary configuration
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

	// Google OAuth configuration
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,

	// Facebook OAuth configuration
	FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,

	// VNPay configuration
	VNP_TMNCODE: process.env.VNP_TMNCODE,
	VNP_HASH_SECRET: process.env.VNP_HASH_SECRET,
	VNP_HOST: process.env.VNP_HOST,
	VNP_URL: process.env.VNP_URL,
	VNP_API: process.env.VNP_API,
	VNP_RETURN_URL: process.env.VNP_RETURN_URL,

	// Momo configuration
	MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY,
	MOMO_SECRET_KEY: process.env.MOMO_SECRET_KEY,
	MOMO_REDIRECT_URL: process.env.MOMO_REDIRECT_URL,

	// ZaloPay configuration
	ZALO_PAY_KEY_1: process.env.ZALO_PAY_KEY_1,
	ZALO_PAY_KEY_2: process.env.ZALO_PAY_KEY_2,
	ZALO_PAY_URL: process.env.ZALO_PAY_URL,

	// Google Cloud Vision
	GOOGLE_CLOUD_KEY_FILE: process.env.GOOGLE_CLOUD_KEY_FILE,
	GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,

	// Image Moderation Settings
	IMAGE_MODERATION_ENABLED: process.env.IMAGE_MODERATION_ENABLED,
	IMAGE_MODERATION_STRICT_MODE: process.env.IMAGE_MODERATION_STRICT_MODE,
	IMAGE_MODERATION_AUTO_REJECT: process.env.IMAGE_MODERATION_AUTO_REJECT,
	IMAGE_MODERATION_CONFIDENCE_THRESHOLD:
		process.env.IMAGE_MODERATION_CONFIDENCE_THRESHOLD,
};
