import { Router } from 'express';
import BookingController from '../controllers/bookingController';
import { bookingSchema } from '../validation/schemas';
import { validator } from '../validation/validator';
import middlewares from '../middlewares';
import { checkBooking } from '../middlewares/checker';

const { auth } = middlewares;

const { createBooking, viewBookings } = BookingController;

const router = Router();

router.post('/create/:requestId/:accommodationId', [auth, checkBooking, validator(bookingSchema)], createBooking);
router.get('/', auth, viewBookings);

export default router;
