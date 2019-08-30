import { Router } from 'express';
import RequestController from '../controllers/requestController';
import { requestSchema } from '../validation/schemas';
import { validator } from '../validation/validator';
import middlewares from '../middlewares';

const router = Router();
const { auth } = middlewares;
const {
<<<<<<< HEAD
  update,
  oneWay,
  multiCityRequest,
  getRequests
=======
  update, oneWay, multiCityRequest, returnRequest
>>>>>>> feature(return-trip):add user return trip
} = RequestController;

router.post('/multi-city', [auth, validator(requestSchema)], multiCityRequest);
router.post('/one-way', [auth, validator(requestSchema)], oneWay);
router.patch('/:requestId', [auth, validator(requestSchema)], update);
<<<<<<< HEAD
router.get('/', auth, getRequests);
=======
router.post('/return', [auth, validator(requestSchema)], returnRequest);
>>>>>>> feature(return-trip):add user return trip

export default router;
