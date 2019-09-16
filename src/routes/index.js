import { Router } from 'express';
import authRoute from './auth';
import requestRoute from './request';
import departmentRoute from './department';
import accommodationRoute from './accommodation';

const router = Router();

router.use('/auth', authRoute);
router.use('/requests', requestRoute);
router.use('/departments', departmentRoute);
router.use('/accommodation', accommodationRoute);


export default router;
