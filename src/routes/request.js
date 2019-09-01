import express from 'express';
import RequestController from '../controllers/requestController';
import { multiCitySchema } from '../validation/schemas';
import { validator } from '../validation/validator';

const { multiCityRequest } = RequestController;
const router = express.Router();

router.post('/multi-city', validator(multiCitySchema), multiCityRequest);

export default router;
