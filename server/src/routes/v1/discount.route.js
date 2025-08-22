import { Router } from 'express';
import * as DiscountController from '../../controllers/discount.controller.js';
import {
	authenticateToken,
	isAdmin,
} from '../../middlewares/auth.middleware.js';

const router = Router();

// Route công khai - không cần auth
router.get('/active', DiscountController.getActiveDiscounts); // Lấy danh sách mã giảm giá đang hoạt động

// router.get('/user/all', DiscountController.getAllDiscountsForUser);

// Các route admin - cần authentication và quyền admin
router.use(authenticateToken);
router.post('/validate', DiscountController.validateDiscountCode);
router.get('/user', DiscountController.getDiscountsForUser); // Lấy danh sách mã giảm giá đang hoạt động cho người dùng

router.use(isAdmin);

router.get('/', DiscountController.getAllDiscounts);
router.get('/:discountId', DiscountController.getDiscountById);
router.get('/:discountId/stats', DiscountController.getDiscountUsageStats);
router.get('/:discountId/usage', DiscountController.getUserDiscountUsage);
router.post('/', DiscountController.createDiscount);
router.put('/:discountId', DiscountController.updateDiscount);
router.delete('/:discountId', DiscountController.deleteDiscount);

export const DiscountRoute = router;
