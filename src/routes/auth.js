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
  roleSchema
} from '../validation/schemas';

const router = express.Router();
const { authenticate, callback } = PassportController;
const {
  loginUser, forgotPassword, resetPassword, signupUser, resendVerification, verifyUser, assignRole
} = AuthController;

router.post('/forgot_password', forgotPassword);
router.patch('/reset_password/:token', validate(passwordResetSchema), resetPassword);
router.post('/signup', validate(signUpSchema), signupUser);
router.get('/verify', verifyUser);
router.post('/resend_verification_link', validate(verifyEmail), resendVerification);
router.patch('/assign_role', authMiddleware, permitUser(['super_admin']), validate(roleSchema), assignRole);
router.post('/login', validator(LogInSchema), loginUser);
router.get('/facebook', authenticate('facebook', ['email', 'public_profile']));
router.get('/facebook/callback', callback('facebook'));
router.get('/google', authenticate('google', ['email', 'profile']));
router.get('/google/callback', callback('google'));

export default router;
