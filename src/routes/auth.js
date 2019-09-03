import express from 'express';
import AuthController from '../controllers/authController';
import verifyUser from '../middlewares/auth';
import {
  signUpSchema, passwordResetSchema, verifyEmail, profileSchema,
} from '../validation/schemas';
import validate from '../validation/validator';

const router = express.Router();
const {
  loginUser,
  forgotPassword,
  resetPassword,
  signupUser,
  verifyUser: verifyNewUser,
  resendVerification,
  getProfile,
  updateProfile,
} = AuthController;

router.post('/login', loginUser);
router.post('/forgot_password', forgotPassword);
router.patch('/reset_password/:token', validate(passwordResetSchema, 'body'), resetPassword);
router.post('/signup', validate(signUpSchema, 'body'), signupUser);
router.get('/verify', verifyNewUser);
router.post('/resend_verification_link', validate(verifyEmail, 'body'), resendVerification);
router.get('/profile', verifyUser, getProfile);
router.patch('/profile', verifyUser, validate(profileSchema, 'body'), updateProfile);

export default router;
