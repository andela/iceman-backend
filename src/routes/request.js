import { Router } from 'express';
import Requests from '../controllers/requestController';
import verify from '../middlewares/verifyToken';
import validate from '../validation/validator';
import { oneWaySchema } from '../validation/schemas';

const route = Router();

route.post('/oneway', validate(oneWaySchema, 'body'), verify, Requests.oneWay);

export default route;
