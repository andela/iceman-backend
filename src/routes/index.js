import { Router } from 'express';
import authRoute from './auth';
import requestRoute from './request';
import bookingRoute from './booking';

const router = Router();

router.use('/auth', authRoute);
router.use('/requests', requestRoute);
router.use('/bookings', bookingRoute);

export default router;
