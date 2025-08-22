import { Router } from 'express';
import * as ProductController from '../../controllers/product.controller.js';
import { authenticateToken, isAdmin } from '../../middlewares/auth.middleware.js';
import { isSeller } from '../../middlewares/seller.middleware.js';
const router = Router();

// Lấy sản phẩm nhóm theo danh mục
router.get('/group-category', ProductController.getProductsGroupedByCategory);

// Lấy thống kê sản phẩm
router.get('/stats', ProductController.getProductStats);

router.get('/', ProductController.getAllProducts);

// Lấy sản phẩm theo slug danh mục (phải đặt trước /:id để tránh conflict)
router.get(
	'/category/:categorySlug',
	ProductController.getProductsByCategorySlug,
);

// Tìm kiếm sản phẩm
router.get('/search', ProductController.searchProducts);

router.get('/:id', ProductController.getProductById);

// Lấy sản phẩm theo người bán (public)
router.get('/seller/:sellerId', ProductController.getProductsBySeller);

router.use(authenticateToken);
// Lấy sản phẩm theo người bán (private)
router.get('/seller ', isSeller, ProductController.getProductsBySeller);

router.put('/verify', isAdmin, ProductController.updateProductVerifyStatus);

router.put('/active', isAdmin, ProductController.updateProductStatus);
export const ProductRoute = router;
