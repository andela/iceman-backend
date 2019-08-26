import express from 'express';
import AuthController from '../controllers/authController';

const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/forgot_password', AuthController.forgotPassword);
router.patch('/reset_password/:token', AuthController.resetPassword);
router.post('/signup', AuthController.signupUser);

export default router;
