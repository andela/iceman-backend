import { Router } from 'express';
import authRoute from './auth';
import requestRoute from './request';
import notificationRoute from './notification';
import accommodationRoute from './accommodation';

const router = Router();

router.use('/auth', authRoute);
router.use('/requests', requestRoute);
router.use('/notification', notificationRoute);
router.use('/accommodation', accommodationRoute);


export default router;
