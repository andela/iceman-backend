import { Router } from 'express';
import AccommodationController from '../controllers/accommodationController';
import middlewares from '../middlewares';
import { validator } from '../validation/validator';
import {
  centreSchema,
  roomSchema,
  accommodationIdSchema,
  feedbackSchema,
  feedbackIdSchema
} from '../validation/schemas';

const router = Router();
const { auth, permitUser, multer } = middlewares;
const {
  addCentre,
  addRoom,
  getAllAccommodation,
  likeAccommodation,
  unlikeAccommodation,
  addFeedback,
  removeFeedback
} = AccommodationController;

router.post('/', [auth, permitUser(['travel_admin']),
  multer.single('image'), validator(centreSchema)], addCentre);
router.post('/:accommodationId/room', [auth, permitUser(['travel_admin']),
  multer.array('images'), validator(roomSchema)], addRoom);
router.get('/', auth, getAllAccommodation);
router.post('/:accommodationId/like', [auth, validator(accommodationIdSchema, 'params')], likeAccommodation);
router.delete('/:accommodationId/like', [auth, validator(accommodationIdSchema, 'params')], unlikeAccommodation);
router.post('/:accommodationId/feedback', [auth, validator(accommodationIdSchema, 'params'), validator(feedbackSchema, 'body')], addFeedback);
router.delete('/feedback/:feedbackId', [auth, validator(feedbackIdSchema, 'params')], removeFeedback);

export default router;
