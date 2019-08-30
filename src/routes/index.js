import { Router } from 'express';
import authRoute from './auth';
import requests from './request';
import userRoute from './user';

const router = Router();

router.use('/auth', authRoute);
router.use('/requests', requests);
router.use('/user', userRoute);

export default router;
