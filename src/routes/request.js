import { Router } from 'express';
import {
  requestSchema, requestIdSchema, responseSchema, commentSchema
} from '../validation/schemas';
import RequestController from '../controllers/requestController';
import { validator } from '../validation/validator';
import userProfile from '../validation/userProfile';
import middlewares from '../middlewares';
import commentController from '../controllers/commentController';

const { postComment, getComment, deleteComment } = commentController;
const router = Router();
const { auth, permitUser } = middlewares;
const {
  update,
  oneWay,
  multiCityRequest,
  getRequests,
  respond,
  availOpenRequests,
  returnRequest,
  search
} = RequestController;

router.patch('/:requestId/respond', [auth, validator(requestIdSchema, 'params'), validator(responseSchema, 'body'), permitUser(['manager'])], respond);
router.post('/multi-city', [auth, userProfile, validator(requestSchema)], multiCityRequest);
router.post('/one-way', [auth, userProfile, validator(requestSchema)], oneWay);
router.patch('/:requestId', [auth, validator(requestIdSchema, 'params'), validator(requestSchema)], update);
router.get('/pending', auth, permitUser(['manager']), availOpenRequests);
router.get('/', auth, getRequests);
router.post('/return', [auth, validator(requestSchema)], returnRequest);
router.get('/search', auth, search);

router.post('/:requestId/comments', [auth, validator(commentSchema)], postComment);
router.get('/:requestId/comments', auth, getComment);
router.delete('/:requestId/comments/:commentId', auth, deleteComment);

export default router;
