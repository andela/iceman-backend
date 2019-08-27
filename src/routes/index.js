import { Router } from 'express';
import authRoute from './auth';

const router = Router();

router.use('/auth', authRoute);

export default router;
