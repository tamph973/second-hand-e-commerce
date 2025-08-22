import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
	{
		fullName: { type: String, trim: true },
		email: { type: String, trim: true },
		password: { type: String, select: false }, // Không trả về khi truy vấn
		address: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
		phoneNumber: { type: String, default: '', trim: true },
		dob: { type: Date, default: null },
		gender: {
			type: String,
			enum: ['MALE', 'FEMALE', 'OTHER'],
			default: 'OTHER',
		},
		avatar: {
			url: { type: String, default: '' },
			public_id: { type: String, default: '' },
		},

		// Cho phép 1 người dùng có nhiều role
		role: {
			type: [String],
			enum: ['USER', 'SELLER', 'ADMIN'],
			default: ['USER'],
		},
		// Seller verification fields
		sellerVerification: {
			balance: { type: Number, default: 0 }, // số dư của seller
			isVerified: { type: Boolean, default: false },
			verificationLevel: {
				type: String,
				enum: ['NONE', 'BASIC', 'ADVANCED', 'PREMIUM'],
				default: 'NONE',
			},
			verificationDate: { type: Date, default: null },
			verificationMethod: {
				type: String,
				enum: [
					'PHONE',
					'EMAIL',
					'CCCD',
					'BANK_ACCOUNT',
					'FACE_VERIFICATION',
				],
				default: null,
			},
			// CCCD/CMND verification
			cccdNumber: { type: String, default: '', select: false },
			cccdFrontImage: {
				url: { type: String, default: '' },
				public_id: { type: String, default: '' },
			},
			cccdBackImage: {
				url: { type: String, default: '' },
				public_id: { type: String, default: '' },
			},
			cccdVerified: { type: Boolean, default: false },
			cccdVerifiedAt: { type: Date, default: null },
			cccdIssuedPlace: { type: String, default: '' },
			cccdIssuedDate: { type: Date, default: null },
			cccdExpiredDate: { type: Date, default: null },
			// extractedInfo: {
			// 	provinceCode: { type: String, default: '' },
			// 	gender: { type: String, enum: ['Nam', 'Nữ'], default: '' },
			// 	birthYear: { type: Number, default: null },
			// 	age: { type: Number, default: null },
			// },
			// Lịch sử thu hồi xác minh
			// revocationHistory: [
			// 	{
			// 		revokedAt: { type: Date, default: Date.now },
			// 		revokedBy: {
			// 			type: mongoose.Schema.Types.ObjectId,
			// 			ref: 'User',
			// 		},
			// 		reason: { type: String, default: '' },
			// 		previousLevel: {
			// 			type: String,
			// 			enum: ['NONE', 'BASIC', 'ADVANCED', 'PREMIUM'],
			// 		},
			// 	},
			// ],
			// Bank account verification
			bankAccount: {
				accountNumber: { type: String, default: '', select: false },
				accountName: { type: String, default: '' },
				bankName: { type: String, default: '' },
				verified: { type: Boolean, default: false },
				verifiedAt: { type: Date, default: null },
			},
			// Business information
			businessInfo: {
				businessName: { type: String, default: '' },
				businessLicense: { type: String, default: '' },
				businessAddress: { type: String, default: '' },
				taxCode: { type: String, default: '', select: false },
				sellerType: {
					type: String,
					enum: ['PERSONAL', 'BUSINESS'],
					default: 'PERSONAL',
				},
			},
			// Seller metrics
			metrics: {
				totalProducts: { type: Number, default: 0 },
				totalSales: { type: Number, default: 0 },
				rating: { type: Number, default: 0 },
				reviewCount: { type: Number, default: 0 },
				responseRate: { type: Number, default: 0 },
				responseTime: { type: Number, default: 0 }, // in hours
			},
			// Seller limits
			limits: {
				maxProducts: { type: Number, default: 5 },
				maxPrice: { type: Number, default: 1000000 }, // 1M VND
				dailyUploadLimit: { type: Number, default: 3 },
			},
			// Verification documents
			documents: [
				{
					type: {
						type: String,
						enum: [
							'CCCD',
							'PASSPORT',
							'DRIVER_LICENSE',
							'BUSINESS_LICENSE',
						],
					},
					url: { type: String },
					public_id: { type: String },
					verified: { type: Boolean, default: false },
					verifiedAt: { type: Date, default: null },
					uploadedAt: { type: Date, default: Date.now },
				},
			],
		},
		refresh_token: { type: String, default: '', select: false }, // Tránh lộ thông tin nhạy cảm
		isPhoneVerified: { type: Boolean, default: false },
		isEmailVerified: { type: Boolean, default: false },
		isCccdVerified: { type: Boolean, default: false },
		lastLogin: { type: Date, default: null },
		typeLogin: { type: [String], default: [] },
		status: {
			type: String,
			enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
			default: 'ACTIVE',
		},
		orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
		wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
		resetPasswordOTP: { type: String, default: '', select: false },
		resetPasswordExpires: { type: Date, default: null, expires: 600 },
		emailChangeOTP: { type: String, default: '', select: false },
		emailChangeExpires: { type: Date, default: null, expires: 600 },
		phoneChangeOTP: { type: String, default: '', select: false },
		phoneChangeExpires: { type: Date, default: null, expires: 600 },
		passwordUpdatedAt: { type: Date, default: null },
		lastActive: { type: Date, default: null },
	},
	{ timestamps: true },
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	try {
		this.password = await bcrypt.hash(this.password, 10);
		return next();
	} catch (err) {
		return next(err);
	}
});

// Compare password entered
UserSchema.methods.isPasswordMatched = async function (enteredPassword) {
	return bcrypt.compare(enteredPassword, this.password);
};

// Đổi mật khẩu
UserSchema.methods.changePassword = async function (newPassword) {
	this.password = newPassword;
	this.passwordUpdatedAt = new Date();
	await this.save();
};

// Xóa OTP sau khi dùng
UserSchema.methods.clearPasswordResetOTP = async function () {
	this.resetPasswordOTP = '';
	this.resetPasswordExpires = null;
	await this.save();
};

// Cập nhật last_login khi đăng nhập thành công
UserSchema.methods.updateLastLogin = async function () {
	this.lastLogin = new Date();
	await this.save();
};

UserSchema.methods.clearEmailChangeOTP = async function () {
	this.emailChangeOTP = '';
	this.emailChangeExpires = null;
	await this.save();
};

UserSchema.methods.clearPhoneChangeOTP = async function () {
	this.phoneChangeOTP = '';
	this.phoneChangeExpires = null;
	await this.save();
};

// Seller verification methods
UserSchema.methods.canCreateProduct = function () {
	// Basic verification required
	return (
		this.sellerVerification.isVerified &&
		this.sellerVerification.verificationLevel !== 'NONE' &&
		this.status === 'ACTIVE'
	);
};

UserSchema.methods.canCreateProductWithPrice = function (price) {
	if (!this.canCreateProduct()) return false;

	// Check price limit based on verification level
	const limits = {
		BASIC: 500000, // 500K VND
		ADVANCED: 2000000, // 2M VND
		PREMIUM: 10000000, // 10M VND
	};

	return price <= limits[this.sellerVerification.verificationLevel];
};

UserSchema.methods.canUploadMoreProducts = function (currentCount) {
	if (!this.canCreateProduct()) return false;

	return currentCount < this.sellerVerification.limits.maxProducts;
};

UserSchema.methods.updateSellerMetrics = async function (metrics) {
	if (metrics.totalProducts !== undefined) {
		this.sellerVerification.metrics.totalProducts = metrics.totalProducts;
	}
	if (metrics.totalSales !== undefined) {
		this.sellerVerification.metrics.totalSales = metrics.totalSales;
	}
	if (metrics.rating !== undefined) {
		this.sellerVerification.metrics.rating = metrics.rating;
	}
	if (metrics.reviewCount !== undefined) {
		this.sellerVerification.metrics.reviewCount = metrics.reviewCount;
	}

	await this.save();
};

UserSchema.methods.upgradeVerificationLevel = async function (newLevel) {
	const levels = ['NONE', 'BASIC', 'ADVANCED', 'PREMIUM'];
	const currentIndex = levels.indexOf(
		this.sellerVerification.verificationLevel,
	);
	const newIndex = levels.indexOf(newLevel);

	if (newIndex > currentIndex) {
		this.sellerVerification.verificationLevel = newLevel;
		this.sellerVerification.verificationDate = new Date();

		// Update limits based on new level
		const newLimits = {
			BASIC: { maxProducts: 10, maxPrice: 1000000, dailyUploadLimit: 5 },
			ADVANCED: {
				maxProducts: 50,
				maxPrice: 2000000,
				dailyUploadLimit: 10,
			},
			PREMIUM: {
				maxProducts: 200,
				maxPrice: 10000000,
				dailyUploadLimit: 20,
			},
		};

		if (newLimits[newLevel]) {
			this.sellerVerification.limits = {
				...this.sellerVerification.limits,
				...newLimits[newLevel],
			};
		}

		await this.save();
		return true;
	}
	return false;
};

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
