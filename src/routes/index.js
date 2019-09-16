import { Router } from 'express';
import authRoute from './auth';
import requestRoute from './request';
import departmentRoute from './department';

const router = Router();

router.use('/auth', authRoute);
router.use('/requests', requestRoute);
router.use('/departments', departmentRoute);

export default router;
