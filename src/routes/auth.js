import express from 'express';
import AuthController from '../controllers/authController';
import PassportController from '../controllers/passportController';


const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/signup', AuthController.signupUser);
router.get('/facebook', PassportController.authenticate('facebook', ['email', 'public_profile']));
router.get('/facebook/callback', PassportController.callback('facebook'));
router.get('/google', PassportController.authenticate('google', ['email', 'profile']));
router.get('/google/callback', PassportController.callback('google'));

export default router;
