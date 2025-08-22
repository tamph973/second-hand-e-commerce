import { Router } from 'express';
import * as AddressController from '../../controllers/address.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// Route để lấy danh sách tỉnh từ sản phẩm (không cần auth)
router.get('/provinces-in-products', AddressController.getProvinceInProduct);

// Các route khác cần authentication
router.use(authenticateToken);
router.get('/', AddressController.getUserAddress);
router.post('/', AddressController.createAddress);
router.put('/:id', AddressController.updateAddress);
router.put('/:id/default', AddressController.setDefaultAddress);
router.delete('/:id', AddressController.deleteAddress);

export const AddressRoute = router;
