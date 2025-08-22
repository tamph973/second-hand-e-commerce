import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.js';
import { uploadAvatar, deleteImage } from '../controllers/upload.controller.js';

const UploadRouter = Router();

UploadRouter.post('/avatar', authenticateToken, upload.single('avatar'), uploadAvatar);
UploadRouter.delete('/', authenticateToken, deleteImage);

export default UploadRouter;
