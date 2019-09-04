import { Router } from 'express';
import authRoute from './auth';
<<<<<<< HEAD
import requestRoute from './request';
=======
import requests from './request';
>>>>>>> feedback implementation

const router = Router();

router.use('/auth', authRoute);
<<<<<<< HEAD
router.use('/requests', requestRoute);
=======
router.use('/requests', requests);
>>>>>>> feedback implementation

export default router;
