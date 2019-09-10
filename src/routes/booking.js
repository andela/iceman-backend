import { Router } from 'express';
import multer from '../middlewares/multer';
import BookingController from '../controllers/bookingController';
import middlewares from '../middlewares';

const router = Router();
const { auth } = middlewares;
const { addCentre, addRoom } = BookingController;

router.post('/centre', [auth, multer.single('image')], addCentre);
router.post('/room', [auth, multer.array('images')], addRoom);

export default router;
