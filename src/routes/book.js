import { Router } from 'express';
import { book } from '../controllers/bookingController';
import { bookingSchema } from '../validation/schemas';
import { validator } from '../validation/validator';
import { auth } from '../middlewares';

const router = Router();

router.post('/bookings/:requestId/:accommodationId', [auth, validator(bookingSchema)], book);

export default router;
