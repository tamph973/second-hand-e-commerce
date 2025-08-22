import express from 'express';
import * as SellerController from '../../controllers/seller.controller.js';
import * as ProductController from '../../controllers/product.controller.js';
import * as VariantController from '../../controllers/variant.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';
import {
	isSeller,
	isVerifiedSeller,
	checkProductLimits,
	checkDailyUploadLimit,
	requireVerificationLevel,
} from '../../middlewares/seller.middleware.js';
import upload from '../../middlewares/multer.js';

const router = express.Router();

// Seller registration and verification routes
router.post('/register', authenticateToken, SellerController.registerAsSeller);

// // Hướng dẫn upload CCCD
// router.get(
// 	'/cccd-guide',
// 	authenticateToken,
// 	SellerController.getCCCDUploadGuide,
// );

// Xác minh CCCD với field names cụ thể
router.post(
	'/verify-cccd',
	authenticateToken,
	isSeller,
	upload.fields([
		{ name: 'cccdFront', maxCount: 1 },
		{ name: 'cccdBack', maxCount: 1 },
	]),
	SellerController.verifyCCCD,
);

// Xác minh CCCD với array (fallback)
router.post(
	'/verify-cccd-array',
	authenticateToken,
	isSeller,
	upload.array('cccdImages', 2),
	SellerController.verifyCCCD,
);

router.post(
	'/verify-bank',
	authenticateToken,
	isSeller,
	SellerController.verifyBankAccount,
);
router.post(
	'/upgrade-level',
	authenticateToken,
	isSeller,
	SellerController.upgradeVerificationLevel,
);

// Seller info routes public
router.get('/:sellerId', SellerController.getSellerInfo);

// Seller info routes private
router.put(
	'/info',
	authenticateToken,
	isSeller,
	SellerController.updateSellerInfo,
);

// Product management routes (require verified seller)
router.post(
	'/products',
	authenticateToken,
	isSeller,
	isVerifiedSeller,
	upload.fields([
		{ name: 'products', maxCount: 10 },
		{ name: 'variants', maxCount: 10 },
	]),
	ProductController.createProduct,
);

router.get(
	'/products',
	authenticateToken,
	isVerifiedSeller,
	ProductController.getMyProducts,
);

router.put(
	'/products/:productId',
	authenticateToken,
	isVerifiedSeller,
	ProductController.updateProduct,
);

router.delete(
	'/products/:productId',
	authenticateToken,
	isVerifiedSeller,
	ProductController.deleteProduct,
);

// Variant management routes
router.get(
	'/products/:productId/variants',
	authenticateToken,
	isVerifiedSeller,
	VariantController.getVariantsByProduct,
);

router.post(
	'/products/:productId/variants',
	authenticateToken,
	isVerifiedSeller,
	VariantController.createVariants,
);

router.put(
	'/variants/:variantId',
	authenticateToken,
	isVerifiedSeller,
	VariantController.updateVariant,
);

router.delete(
	'/variants/:variantId',
	authenticateToken,
	isVerifiedSeller,
	VariantController.deleteVariant,
);

// Premium features (require ADVANCED or PREMIUM level)
router.post(
	'/products/premium',
	authenticateToken,
	isVerifiedSeller,
	requireVerificationLevel('ADVANCED'),
	checkProductLimits,
	checkDailyUploadLimit,
	ProductController.createProduct,
);

// Dashboard routes
router.get(
	'/dashboard/stats',
	authenticateToken,
	isSeller,
	SellerController.getDashboardStats,
);

router.get(
	'/dashboard/order-stats',
	authenticateToken,
	isSeller,
	SellerController.getOrderStats,
);

router.get(
	'/dashboard/revenue',
	authenticateToken,
	isSeller,
	SellerController.getRevenueData,
);

router.get(
	'/dashboard/recent-orders',
	authenticateToken,
	isSeller,
	SellerController.getRecentOrders,
);

export const SellerRoute = router;
