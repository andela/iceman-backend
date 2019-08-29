import express from 'express';
import UsersController from '../controllers/usersController';
import authMiddleware from '../middlewares/auth';
import { profileSchema } from '../validation/schemas';
import validate from '../validation/validator';

const router = express.Router();

router.get('/me', authMiddleware, UsersController.getProfile);
router.patch('/me', authMiddleware, validate(profileSchema, 'body'), UsersController.updateProfile);

export default router;
