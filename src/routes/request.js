import { Router } from 'express';
import requestController from '../controllers/requestController';
import { requestSchema } from '../validation/schemas';
import validate from '../validation/validator';
import verifyUser from '../middlewares/auth';

const router = Router();

router.patch('/request/:id', validate(requestSchema, 'body'), verifyUser, requestController.updateRequest);


export default router;
