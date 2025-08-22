import { Router } from 'express';
import * as VariantController from '../../controllers/variant.controller.js';

const router = Router();

router.get('/:productId', VariantController.getVariantsByProduct);

export const VariantRoute = router;
