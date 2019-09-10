import { Router } from 'express';
import multer from '../middlewares/multer';
import BookingController from '../controllers/bookingController';
import middlewares from '../middlewares';
import permitUser from '../middlewares/permission';
import { validator } from '../validation/validator';
import { centreSchema, roomSchema } from '../validation/schemas';

const router = Router();
const { auth } = middlewares;
const { addCentre, addRoom } = BookingController;

router.post('/centre', [auth, permitUser(['travel_admin']),
  multer.single('image'), validator(centreSchema)], addCentre);
router.post('/:centreId/room', [auth, permitUser(['travel_admin']),
  multer.array('images'), validator(roomSchema)], addRoom);

export default router;
