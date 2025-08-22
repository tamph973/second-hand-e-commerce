import express from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware.js';
import {
	createReview,
	getProductReviews,
	getUserReview,
	updateReview,
	deleteReview,
} from '../../controllers/review.controller.js';
import upload from '../../middlewares/multer.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.use(authenticateToken);

// User routes
router.post('/', upload.array('images', 10), createReview);
router.get('/user/:productId', getUserReview);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

export default router;
