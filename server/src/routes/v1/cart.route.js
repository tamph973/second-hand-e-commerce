import { Router } from 'express';
import * as CartController from '../../controllers/cart.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', CartController.getUserCart);

router.post('/', CartController.addToCart);

router.put('/', CartController.updateCartItemQuantity);

router.delete('/product', CartController.removeFromCart);

router.delete('/clear', CartController.clearCart);

router.post('/apply-coupon', CartController.applyCoupon);

router.delete('/remove-coupon', CartController.removeCoupon);

export const CartRoute = router;
