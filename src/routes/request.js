import express from 'express';
import RequestController from '../controllers/requestController';

const router = express.Router();

router.post('/multi-city', RequestController.multiCityRequest);

export default router;
