import express from 'express';
import passport from 'passport';
import AuthController from '../controllers/authController';
import { googlePlugin, facebookPlugin } from '../middlewares/socialPassport';

const router = express.Router();

router.post('/login', AuthController.loginUser);
// router.post('/google', AuthController.googleLogIn);
router.post('/signup', AuthController.signupUser);
// router.post('/login', passport.authenticate('local'));
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
router.get('/facebook/callback', facebookPlugin);
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', googlePlugin);

export default router;
