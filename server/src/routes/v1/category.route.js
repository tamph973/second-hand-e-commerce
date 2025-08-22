import { Router } from 'express';
import * as CategoryController from '../../controllers/category.controller.js';
import {
	authenticateToken,
	isAdmin,
} from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/multer.js';

const router = Router();

// Public route: Lấy tree danh mục
router.get('/tree', CategoryController.getCategoryTree);

// Lấy tất cả danh mục
router.get('/', CategoryController.getAllCategory);

// Lấy danh mục con theo parentId
router.get('/children/:parentId', CategoryController.getCategoryChildren);

// Lấy danh mục con
router.get('/sub', CategoryController.getSubCategories);

// Lấy danh mục theo shop
router.get('/shop/:shopId', CategoryController.getCategoryByShop);

// Các route dưới đây yêu cầu authentication và admin role
router.use(authenticateToken, isAdmin);

// Tạo danh mục mới
router.post('/', upload.single('image'), CategoryController.createCategory);

// Lấy thông tin danh mục theo ID
router.get('/:id', CategoryController.getCategoryById);

// Cập nhật danh mục
router.put('/:id', upload.single('image'), CategoryController.updateCategory);

// Xóa danh mục
router.delete('/:id', CategoryController.deleteCategory);

// Routes công khai (không yêu cầu authentication)
// router.get('/public', CategoryController.getPublicCategories);

export const CategoryRoute = router;
