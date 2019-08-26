import express from 'express';
import passport from 'passport';
import AuthController from '../controllers/authController';

const router = express.Router();

router.post('/login', AuthController.loginUser);
// router.post('/google', AuthController.googleLogIn);
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

export default router;
