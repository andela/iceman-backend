import { Router } from 'express';
import NotificationController from '../controllers/notificationController';
import { optSchema } from '../validation/schemas';
import { validator } from '../validation/validator';
import middlewares from '../middlewares';

const router = Router();
const { auth } = middlewares;
const {
  optEmail,
  getNotification,
  markAllAsRead
} = NotificationController;

router.patch('/opt_email', [auth, validator(optSchema)], optEmail);
router.get('/', auth, getNotification);
router.patch('/mark_all_read', auth, markAllAsRead);

export default router;
