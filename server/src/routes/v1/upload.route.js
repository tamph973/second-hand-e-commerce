import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/multer.js';
import {
	uploadAvatar,
	deleteImage,
} from '../../controllers/upload.controller.js';

const router = Router();

router.post(
	'/avatar',
	authenticateToken,
	upload.single('avatar'),
	uploadAvatar,
);
router.delete('/', authenticateToken, deleteImage);

export const UploadRoute = router;
