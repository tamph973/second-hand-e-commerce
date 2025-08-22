import { Router } from 'express';
import * as OrderController from '../../controllers/order.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';
import { isSeller } from '../../middlewares/seller.middleware.js';
const router = Router();

// Buyer
router.use(authenticateToken);
router.post('/', OrderController.createOrder);
router.get('/', OrderController.getAllOrders);
router.get('/seller', OrderController.getSellerOrders);
router.get('/:orderId', OrderController.getOrderDetail);
router.get('/details/:paymentId', OrderController.getOrderDetails);
router.put('/', OrderController.updateOrder);
router.put(
	'/status/:orderId',
	authenticateToken,
	isSeller,
	OrderController.updateOrderStatus,
);
router.put('/:orderId/confirm-received', OrderController.confirmOrderReceived);
router.put('/:orderId/cancel', OrderController.cancelOrder);

export const OrderRoutes = router;
