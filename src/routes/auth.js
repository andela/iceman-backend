import express from 'express';
import AuthController from '../controllers/authController';
import schemas from '../validation/schemas';
import validate from '../validation/validator';

const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/signup', validate(schemas.user), AuthController.signupUser);
router.post('/forgot_password', AuthController.forgotPassword);
router.patch('/reset_password/:token', AuthController.resetPassword);

export default router;
