import express from 'express';
import AuthController from '../controllers/authController';
import { signUpSchema } from '../validation/schemas';
import validate from '../validation/validator';

const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/signup', validate(signUpSchema, 'body'), AuthController.signupUser);

export default router;
