import { Router } from 'express';
import RequestController from '../controllers/requestController';
import { requestSchema } from '../validation/schemas';
import { validator } from '../validation/validator';
import userProfile from '../validation/userProfile';
import middlewares from '../middlewares';


const router = Router();
const { auth } = middlewares;
const {
  update,
  oneWay,
  multiCityRequest,
  getRequests,
  returnRequest
} = RequestController;

router.post('/multi-city', [auth, userProfile, validator(requestSchema)], multiCityRequest);
router.post('/one-way', [auth, userProfile, validator(requestSchema)], oneWay);
router.patch('/:requestId', [auth, validator(requestSchema)], update);
router.get('/', auth, getRequests);
router.post('/return', [auth, userProfile, validator(requestSchema)], returnRequest);

export default router;
