import { Router } from 'express';
import { requestSchema, requestIdSchema, responseSchema } from '../validation/schemas';
import RequestController from '../controllers/requestController';
import { requestSchema } from '../validation/schemas';
import { validator } from '../validation/validator';
import middlewares from '../middlewares';
import permitUser from '../middlewares/permission';
import requestController from '../controllers/requestController';
import { requestSchema, oneWaySchema, requestIdSchema } from '../validation/schemas';
import validate from '../validation/validator';
import verifyUser from '../middlewares/auth';

const router = Router();
const { auth } = middlewares;
const {
  update,
  oneWay,
  multiCityRequest,
  getRequests,
  respond,
  availOpenRequests,
  returnRequest,
  search,
  reject,
} = RequestController;

router.patch('/:requestId/respond', [auth, validator(requestIdSchema, 'params'), validator(responseSchema, 'body'), permitUser(['manager'])], respond);
router.post('/multi-city', [auth, validator(requestSchema)], multiCityRequest);
router.post('/one-way', [auth, validator(requestSchema)], oneWay);
router.patch('/:requestId', [auth, validator(requestSchema)], update);
router.get('/pending', auth, permitUser(['manager']), availOpenRequests);
router.get('/', auth, getRequests);
router.post('/return', [auth, validator(requestSchema)], returnRequest);
router.get('/search', auth, search);
router.post('/oneway', validate(oneWaySchema, 'body'), verifyUser, oneWay);
router.patch('/:requestId', validate(requestIdSchema, 'params'), validate(requestSchema, 'body'), verifyUser, update);
router.get('/:requestId', validate(requestIdSchema, 'params'), verifyUser, getRequest);
router.patch('/:requestId/reject', validate(requestIdSchema, 'params'), verifyUser, reject);


export default router;
