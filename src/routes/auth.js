import express from 'express';
import AuthController from '../controllers/authController';
import PassportController from '../controllers/passportController';
import validate, { validator } from '../validation/validator';
import authMiddleware from '../middlewares/auth';
import permitUser from '../middlewares/permission';
import {
  signUpSchema,
  passwordResetSchema,
  verifyEmail,
  LogInSchema,
  roleSchema,
  rememberSchema
} from '../validation/schemas';

const router = express.Router();
const { authenticate, callback } = PassportController;
const {
  loginUser, forgotPassword, resetPassword, signupUser, resendVerification, verifyUser, assignRole,
  rememberProfile, getUserInformation
} = AuthController;

router.post('/forgot_password', forgotPassword);
router.patch('/reset_password/:token', validate(passwordResetSchema, 'body'), resetPassword);
router.post('/signup', validate(signUpSchema, 'body'), signupUser);
router.get('/verify', verifyUser);
router.post('/resend_verification_link', validate(verifyEmail, 'body'), resendVerification);
router.patch('/assign_role', authMiddleware, permitUser(['super_admin']), validate(roleSchema, 'body'), assignRole);
router.post('/login', validator(LogInSchema), loginUser);
router.get('/facebook', authenticate('facebook', ['email', 'public_profile']));
router.get('/facebook/callback', callback('facebook'));
router.get('/google', authenticate('google', ['email', 'profile']));
router.get('/google/callback', callback('google'));
router.patch('/remember_profile', authMiddleware, validate(rememberSchema, 'body'), rememberProfile);
router.get('/user_information', authMiddleware, getUserInformation);

export default router;
