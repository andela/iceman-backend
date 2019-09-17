import { Router } from 'express';
import AccommodationController from '../controllers/accommodationController';
import middlewares from '../middlewares';
import { validator } from '../validation/validator';
import {
  accommodationSchema,
  roomSchema,
  accommodationIdSchema,
  feedbackSchema,
  feedbackIdSchema
} from '../validation/schemas';

const router = Router();
const { auth, permitUser, multer } = middlewares;
const {
  createAccommodation,
  createRoom,
  getAllAccommodation,
  updateAccommodation,
  deleteAccommodation,
  deleteRoom,
  updateRoom,
  likeAccommodation,
  unlikeAccommodation,
  addFeedback,
  removeFeedback
} = AccommodationController;

router.get('/', auth, getAllAccommodation);
router.post('/', [auth, permitUser(['travel_admin']),
  multer.single('image'), validator(accommodationSchema)], createAccommodation);
router.patch('/:id', [auth, permitUser(['travel_admin']),
  multer.single('image'), validator(accommodationSchema)], updateAccommodation);
router.delete('/:id', [auth, permitUser(['travel_admin'])], deleteAccommodation);
router.post('/:accommodationId/room', [auth, permitUser(['travel_admin']),
  multer.array('images'), validator(roomSchema)], createRoom);
router.patch('/:id/room', [auth, permitUser(['travel_admin']),
  multer.array('images'), validator(roomSchema)], updateRoom);
router.delete('/:id/room', [auth, permitUser(['travel_admin'])], deleteRoom);
router.get('/', auth, getAllAccommodation);
router.post('/:accommodationId/like', [auth, validator(accommodationIdSchema, 'params')], likeAccommodation);
router.delete('/:accommodationId/like', [auth, validator(accommodationIdSchema, 'params')], unlikeAccommodation);
router.post('/:accommodationId/feedback', [auth, validator(accommodationIdSchema, 'params'), validator(feedbackSchema, 'body')], addFeedback);
router.delete('/feedback/:feedbackId', [auth, validator(feedbackIdSchema, 'params')], removeFeedback);


export default router;
