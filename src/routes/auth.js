import express from 'express';
import AuthController from '../controllers/authController';
import { signUpSchema, passwordResetSchema, verifyEmail } from '../validation/schemas';
import validate from '../validation/validator';

const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/forgot_password', AuthController.forgotPassword);
router.patch('/reset_password/:token', validate(passwordResetSchema, 'body'), AuthController.resetPassword);
router.post('/signup', validate(signUpSchema, 'body'), AuthController.signupUser);
router.get('/verify', AuthController.verifyUser);
router.post('/resend_verification_link', validate(verifyEmail, 'body'), AuthController.resendVerification);

export default router;
