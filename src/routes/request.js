import { Router } from 'express';
import RequestController from '../controllers/requestController';
import { requestSchema } from '../validation/schemas';
import { validator } from '../validation/validator';
import middlewares from '../middlewares';

const router = Router();
const { auth } = middlewares;
const {
  update,
  oneWay,
  multiCityRequest,
  getRequests,
  returnRequest,
  search
} = RequestController;

router.post('/multi-city', [auth, validator(requestSchema)], multiCityRequest);
router.post('/one-way', [auth, validator(requestSchema)], oneWay);
router.patch('/:requestId', [auth, validator(requestSchema)], update);
router.get('/', auth, getRequests);
router.post('/return', [auth, validator(requestSchema)], returnRequest);
router.get('/search?', auth, search);

export default router;
