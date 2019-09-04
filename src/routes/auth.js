import express from 'express';
import AuthController from '../controllers/authController';
import PassportController from '../controllers/passportController';
import validate from '../validation/validator';
import authMiddleware from '../middlewares/auth';
import permitUser from '../middlewares/permission';
import {
  signUpSchema, passwordResetSchema, verifyEmail, roleSchema
} from '../validation/schemas';

const router = express.Router();

const {
  loginUser, forgotPassword, resetPassword, signupUser, resendVerification, verifyUser, assignRole
} = AuthController;

router.post('/login', loginUser);
router.post('/forgot_password', forgotPassword);
router.patch('/reset_password/:token', validate(passwordResetSchema, 'body'), resetPassword);
router.post('/signup', validate(signUpSchema, 'body'), signupUser);
router.get('/verify', verifyUser);
router.post('/resend_verification_link', validate(verifyEmail, 'body'), resendVerification);
router.patch('/assign_role', authMiddleware, permitUser(['super_admin']), validate(roleSchema, 'body'), assignRole);
router.get('/facebook', PassportController.authenticate('facebook', ['email', 'public_profile']));
router.get('/facebook/callback', PassportController.callback('facebook'));
router.get('/google', PassportController.authenticate('google', ['email', 'profile']));
router.get('/google/callback', PassportController.callback('google'));

export default router;
