import { Router } from 'express';
import authRoute from './auth';
import requestRoute from './request';

const router = Router();


router.use('/auth', authRoute);
router.use(requestRoute);

export default router;
