import { Router } from 'express';
import authRoute from './auth';
import Signup from '../../controllers/signup';

const router = Router();


router.use('/auth', authRoute);
router.get('/verify', Signup.verify);

export default router;
