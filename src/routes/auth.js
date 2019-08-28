import express from 'express';
import AuthController from '../controllers/authController';
import PassportController from '../controllers/passportController';
import { signUpSchema } from '../validation/schemas';
import validate from '../validation/validator';

const router = express.Router();

router.post('/login', AuthController.loginUser);
router.get('/facebook', PassportController.authenticate('facebook', ['email', 'public_profile']));
router.get('/facebook/callback', PassportController.callback('facebook'));
router.get('/google', PassportController.authenticate('google', ['email', 'profile']));
router.get('/google/callback', PassportController.callback('google'));
router.post('/signup', validate(signUpSchema, 'body'), AuthController.signupUser);

export default router;
