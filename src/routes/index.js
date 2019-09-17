import { Router } from 'express';
import authRoute from './auth';
import requestRoute from './request';
import accommodationRoute from './accommodation';
import bookingRoute from './book';

const router = Router();

router.use('/auth', authRoute);
router.use('/requests', requestRoute);
router.use('/accommodation', accommodationRoute);
router.use('/bookings', bookingRoute);


export default router;
