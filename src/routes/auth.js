import express from 'express';
import AuthController from '../controllers/authController';
import middlewares from '../middlewares';
import PassportController from '../controllers/passportController';
import validate, { validator } from '../validation/validator';
import {
  signUpSchema,
  passwordResetSchema,
  verifyEmail,
  LogInSchema,
  roleSchema,
  profileSchema,
} from '../validation/schemas';

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
  assignRole
} = AuthController;
const { authenticate, callback } = PassportController;
const { auth, permitUser } = middlewares;

router.post('/forgot_password', forgotPassword);
router.patch('/reset_password/:token', validate(passwordResetSchema, 'body'), resetPassword);
router.post('/signup', validate(signUpSchema, 'body'), signupUser);
router.get('/verify', verifyUser);
router.post('/resend_verification_link', validate(verifyEmail, 'body'), resendVerification);
router.get('/profile', auth, getProfile);
router.patch('/profile', auth, validate(profileSchema, 'body'), updateProfile);
router.patch('/assign_role', auth, permitUser(['super_admin']), validate(roleSchema, 'body'), assignRole);
router.post('/login', validator(LogInSchema), loginUser);
router.get('/facebook', authenticate('facebook', ['email', 'public_profile']));
router.get('/facebook/callback', callback('facebook'));
router.get('/google', authenticate('google', ['email', 'profile']));
router.get('/google/callback', callback('google'));

export default router;
