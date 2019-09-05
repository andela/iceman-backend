import { Router } from 'express';
import requestController from '../controllers/requestController';
import { requestSchema, oneWaySchema, requestIdSchema } from '../validation/schemas';
import validate from '../validation/validator';
import verifyUser from '../middlewares/auth';

const router = Router();

const {
  update, oneWay, getRequest, reject,
} = requestController;

router.post('/oneway', validate(oneWaySchema, 'body'), verifyUser, oneWay);
router.patch('/:requestId', validate(requestIdSchema, 'params'), validate(requestSchema, 'body'), verifyUser, update);
router.get('/:requestId', validate(requestIdSchema, 'params'), verifyUser, getRequest);
router.patch('/:requestId/reject', validate(requestIdSchema, 'params'), verifyUser, reject);


export default router;
