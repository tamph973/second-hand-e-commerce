import { Router } from 'express';
import * as WishlistController from '../../controllers/wishlist.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// Lấy danh sách wishlist của user
router.get('/', WishlistController.getUserWishlist);

// Lấy số lượng wishlist của user
router.get('/count', WishlistController.getWishlistCount);

// Kiểm tra sản phẩm có trong wishlist không
router.get('/check/:productId', WishlistController.checkWishlistStatus);

// Thêm sản phẩm vào wishlist
router.post('/', WishlistController.addToWishlist);

// Toggle wishlist (thêm/xóa)
router.post('/toggle', WishlistController.toggleWishlist);

// Xóa sản phẩm khỏi wishlist
router.delete('/:productId', WishlistController.removeFromWishlist);

// Xóa tất cả wishlist của user
router.delete('/', WishlistController.clearWishlist);

export const WishlistRoute = router;
