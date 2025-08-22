import { Router } from 'express';
import * as UserController from '../../controllers/user.controller.js';
import {
	authenticateToken,
	isAdmin,
} from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', UserController.getUserData);
router.put('/', UserController.updateUser);
router.put('/change-password', UserController.changePassword);

router.use(isAdmin);
router.get('/all', UserController.getAllUser);

// router.put('/password', authenticateToken, UserCtrl.updatePassword);
//
// router.post('/cart', authenticateToken, UserCtrl.userCart);
// router.post('/cart/apply-coupon', authenticateToken, UserCtrl.applyCoupon);
// router.post('/order', authenticateToken, UserCtrl.createOrder);
// router.put('/order/update-status/:id', authenticateToken, isAdmin, UserCtrl.updateOrderStatus);

// router.get('/', UserCtrl.getAllUsers);
// router.get('/get-order', authenticateToken, UserCtrl.getOrder);
// router.get('/all-order', authenticateToken, isAdmin, UserCtrl.getAllOrder);
// router.get('/get-order/:id', authenticateToken, isAdmin, UserCtrl.getOrderByUserId);
// router.get('/cart', authenticateToken, UserCtrl.getUserCart);
// router.get('/wishlist', authenticateToken, UserCtrl.getWishList);
// router.get('/:id', authenticateToken, isAdmin, UserCtrl.getUser);
// router.put('/edit-user', authenticateToken, UserCtrl.updateUser);
// router.put('/save-address', authenticateToken, UserCtrl.saveAddress);
// router.put('/block-user/:id', authenticateToken, isAdmin, UserCtrl.blockUser);
// router.put('/unblock-user/:id', authenticateToken, isAdmin, UserCtrl.unblockUser);
// router.delete('/empty-cart', authenticateToken, UserCtrl.emptyCart);
// router.delete('/:id', UserCtrl.deleteUser);

export const UserRoute = router;
