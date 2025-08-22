import { Router } from 'express';
import * as BrandController from '../../controllers/brand.controller.js';
import {
	authenticateToken,
	isAdmin,
} from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/multer.js';

const router = Router();

router.get('/', BrandController.getAllBrands);

router.use(authenticateToken, isAdmin);
// Tạo thương hiệu mới
router.post('/', upload.single('image'), BrandController.createBrand);
router.delete('/:id', BrandController.deleteBrand);

export const BrandRoute = router;
