import express from 'express';
import AuthController from '../controllers/authController';
import middlewares from '../middlewares';
import PassportController from '../controllers/passportController';
import {
  signUpSchema,
  passwordResetSchema,
  verifyEmail,
  LogInSchema,
  profileSchema,
} from '../validation/schemas';
import validate from '../validation/validator';

const router = express.Router();
const {
  loginUser,
  forgotPassword,
  resetPassword,
  signupUser,
  verifyUser,
  resendVerification,
  getProfile,
  updateProfile,
} = AuthController;
const { authenticate, callback } = PassportController;
const { auth } = middlewares;

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
router.get('/profile', auth, getProfile);
router.patch('/profile', auth, validate(profileSchema, 'body'), updateProfile);

export default router;
