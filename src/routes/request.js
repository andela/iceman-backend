import { Router } from 'express';
import requestController from '../controllers/requestController';
import { requestSchema } from '../validation/schemas';
import validate from '../validation/validator';
import verifyUser from '../middlewares/auth';

const router = Router();

const { update } = requestController;

router.patch('/:requestId', validate(requestSchema, 'body'), verifyUser, update);


export default router;
