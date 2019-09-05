import express from 'express';
import AuthController from '../controllers/authController';
import PassportController from '../controllers/passportController';
import {
  signUpSchema,
  passwordResetSchema,
  verifyEmail,
  LogInSchema
} from '../validation/schemas';
import validate from '../validation/validator';

const router = express.Router();
const { authenticate, callback } = PassportController;
const {
  loginUser,
  forgotPassword,
  resetPassword,
  signupUser,
  verifyUser,
  resendVerification
} = AuthController;

router.post('/login', validate(LogInSchema, 'body'), loginUser);
router.get('/facebook', authenticate('facebook', ['email', 'public_profile']));
router.get('/facebook/callback', callback('facebook'));
router.get('/google', authenticate('google', ['email', 'profile']));
router.get('/google/callback', callback('google'));
router.post('/forgot_password', forgotPassword);
router.patch('/reset_password/:token', validate(passwordResetSchema, 'body'), resetPassword);
router.post('/signup', validate(signUpSchema, 'body'), signupUser);
router.get('/verify', verifyUser);
router.post('/resend_verification_link', validate(verifyEmail, 'body'), resendVerification);

export default router;
