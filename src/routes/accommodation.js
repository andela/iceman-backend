import { Router } from 'express';
import multer from '../middlewares/multer';
import AccommodationController from '../controllers/accommodationController';
import middlewares from '../middlewares';
import permitUser from '../middlewares/permission';
import { validator } from '../validation/validator';
import { accommodationSchema, roomSchema } from '../validation/schemas';

const router = Router();
const { auth } = middlewares;
const {
  createAccommodation,
  createRoom,
  getAllAccommodation,
  updateAccommodation,
  deleteAccommodation,
  deleteRoom,
  updateRoom
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

export default router;
