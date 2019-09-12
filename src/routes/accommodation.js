import { Router } from 'express';
import multer from '../middlewares/multer';
import AccommodationController from '../controllers/accommodationController';
import middlewares from '../middlewares';
import { validator } from '../validation/validator';
import { centreSchema, roomSchema, accommodationIdSchema } from '../validation/schemas';

const router = Router();
const { auth, permitUser } = middlewares;
const {
  addCentre, addRoom, getAllAccommodation, likeAccommodation, unlikeAccommodation
} = AccommodationController;

router.post('/', [auth, permitUser(['travel_admin']),
  multer.single('image'), validator(centreSchema)], addCentre);
router.post('/:accommodationId/room', [auth, permitUser(['travel_admin']),
  multer.array('images'), validator(roomSchema)], addRoom);
router.get('/', auth, getAllAccommodation);
router.post('/:accommodationId/like', [auth, validator(accommodationIdSchema, 'params')], likeAccommodation);
router.delete('/:accommodationId/like', [auth, validator(accommodationIdSchema, 'params')], unlikeAccommodation);

export default router;
