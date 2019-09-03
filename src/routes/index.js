import { Router } from 'express';
import authRoute from './auth';
import requests from './request';

const router = Router();

router.use('/auth', authRoute);
router.use('/requests', requests);

export default router;
