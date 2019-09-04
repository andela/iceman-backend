import { Router } from 'express';
import RequestController from '../controllers/requestController';
import { requestSchema } from '../validation/schemas';
import { validator } from '../validation/validator';
import auth from '../middlewares';

const router = Router();
const { update, oneWay, multiCityRequest } = RequestController;

router.post('/multi-city', [auth, validator(requestSchema)], multiCityRequest);
router.post('/one-way', [auth, validator(requestSchema)], oneWay);
router.patch('/:requestId', [auth, validator(requestSchema)], update);

export default router;
