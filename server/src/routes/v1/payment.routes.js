import { Router } from 'express';
import * as PaymentController from '../../controllers/payment.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/vnpay', authenticateToken, PaymentController.vnpayPayment);
router.get('/vnpay-return', PaymentController.handleVNPayReturn);
router.post('/momo', authenticateToken, PaymentController.momoPayment);
router.get('/momo-return', PaymentController.handleMoMoReturn);
router.get('/history', authenticateToken, PaymentController.getPaymentHistory);
router.post('/zalo-pay', authenticateToken, PaymentController.zaloPayPayment);
router.get('/zalo-pay-query', PaymentController.handleQueryZaloPay);

// // API kích hoạt Cron Job (có thể gọi thủ công để test)
router.put('/release-escrow', PaymentController.releaseEscrow);

export const PaymentRoutes = router;
