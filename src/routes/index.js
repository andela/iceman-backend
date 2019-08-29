import { Router } from 'express';
import authRoute from './auth';
import usersRoute from './users';

const router = Router();


router.use('/auth', authRoute);
router.use('/users', usersRoute);

export default router;
