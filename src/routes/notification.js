import { Router } from 'express';
import NotificationController from '../controllers/notificationController';
import { optSchema } from '../validation/schemas';
import { validator } from '../validation/validator';
import middlewares from '../middlewares';

const router = Router();
const { auth } = middlewares;
const {
  optEmail,
  getSpecificNotification,
  markAllAsRead,
  getAllNotification,
  clearAllNotification
} = NotificationController;

router.patch('/opt_email', [auth, validator(optSchema)], optEmail);
router.get('/', auth, getAllNotification);
router.get('/:notificationId', auth, getSpecificNotification);
router.patch('/mark_all_read', auth, markAllAsRead);
router.delete('/clear', auth, clearAllNotification);

export default router;
