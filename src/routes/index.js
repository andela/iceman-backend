import { Router } from 'express';
import authRoute from './auth';
import requestRoute from './request';
import auth from '../middlewares/auth';

const router = Router();

router.use('/auth', authRoute);
router.use('/requests', auth, requestRoute);

export default router;
