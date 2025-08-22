import { Router } from 'express';
import * as AuthController from '../../controllers/auth.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/verify-email', AuthController.verifyEmail);
router.post('/auth-social', AuthController.authSocial);
router.get('/google', AuthController.authGoogle);
router.put('/forgot-password', AuthController.forgotPassword);
router.put('/reset-password', AuthController.resetPassword);
router.put('/verify-otp', AuthController.verifyOTP);
router.put('/verify-change-email', AuthController.verifyChangeEmail);
router.use(authenticateToken);
router.put('/verify-phone-otp', AuthController.verifyPhoneOTP);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/user', AuthController.getAuthUser);
router.put('/change-email', AuthController.changeEmail);
router.post('/send-phone-otp', AuthController.sendPhoneOTP);
router.put('/change-password', AuthController.changePassword);
router.post('/send-sms', AuthController.sendSMS);

export const AuthRoute = router;
