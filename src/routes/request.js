import { Router } from 'express';
import RequestController from '../controllers/requestController';
import { requestSchema } from '../validation/schemas';
import { validator } from '../validation/validator';
import middlewares from '../middlewares';
import permitUser from '../middlewares/permission';

const router = Router();
const { auth } = middlewares;
const {
  update,
  oneWay,
  multiCityRequest,
  getRequests,
  openRequests
} = RequestController;

router.post('/multi-city', [auth, validator(requestSchema)], multiCityRequest);
router.post('/one-way', [auth, validator(requestSchema)], oneWay);
router.patch('/:requestId', [auth, validator(requestSchema)], update);
router.get('/pending', auth, permitUser(['manager']), openRequests);
router.get('/', auth, getRequests);


export default router;
