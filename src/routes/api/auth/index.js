import express from 'express';
import Signup from '../../../controllers/signup';

const router = express.Router();

router.post('/signup', Signup.register);

export default router;
