import { Router } from 'express';
import { requestSchema, requestIdSchema } from '../validation/schemas';
import RequestController from '../controllers/requestController';
import { validator } from '../validation/validator';
import middlewares from '../middlewares';

const router = Router();
const { auth, permitUser } = middlewares;
const {
  update,
  oneWay,
  multiCityRequest,
  getRequests,
  reject,
  availOpenRequests,
  returnRequest
} = RequestController;


router.patch('/:requestId/reject', [auth, validator(requestIdSchema, 'params'), permitUser(['manager'])], reject);
router.post('/multi-city', [auth, validator(requestSchema)], multiCityRequest);
router.post('/one-way', [auth, validator(requestSchema)], oneWay);
router.patch('/:requestId', [auth, validator(requestIdSchema, 'params'), validator(requestSchema)], update);
router.get('/pending', auth, permitUser(['manager']), availOpenRequests);
router.get('/', auth, getRequests);
router.post('/return', [auth, validator(requestSchema)], returnRequest);


export default router;
