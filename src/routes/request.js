import { Router } from 'express';
import RequestController from '../controllers/requestController';
import { requestSchema, oneWaySchema, multiCitySchema } from '../validation/schemas';
import validate, { validator } from '../validation/validator';
import auth from '../middlewares';
import verifyUser from '../middlewares/auth';

const router = Router();
const { update, oneWay, multiCityRequest } = RequestController;

router.post('/multi-city', [auth, validator(multiCitySchema)], multiCityRequest);
router.post('/oneway', validate(oneWaySchema, 'body'), verifyUser, oneWay);
router.patch('/:requestId', validate(requestSchema, 'body'), verifyUser, update);

export default router;
