import { Router } from 'express';
import multer from '../middlewares/multer';
import AccommodationController from '../controllers/accommodationController';
import middlewares from '../middlewares';
import permitUser from '../middlewares/permission';
import { validator } from '../validation/validator';
import { centreSchema, roomSchema } from '../validation/schemas';

const router = Router();
const { auth } = middlewares;
const { addCentre, addRoom } = AccommodationController;

router.post('/', [auth, permitUser(['travel_admin']),
  multer.single('image'), validator(centreSchema)], addCentre);
router.post('/:accommodationId/room', [auth, permitUser(['travel_admin']),
  multer.array('images'), validator(roomSchema)], addRoom);

export default router;
