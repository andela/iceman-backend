import { Router } from 'express';
import authRoute from './auth';
import requestRoute from './request';
import notificationRoute from './notification';

const router = Router();

router.use('/auth', authRoute);
router.use('/requests', requestRoute);
router.use('/notification', notificationRoute);

export default router;
