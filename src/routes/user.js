import express from 'express';
import userController from '../controllers/userController';
import { roleSchema } from '../validation/schemas';
import validate from '../validation/validator';
import authMiddleware from '../middlewares/auth';
import permitUser from '../middlewares/permission';


const router = express.Router();

router.patch('/:roleId/assign_role', authMiddleware, permitUser(['super_admin']), validate(roleSchema, 'body'), userController.assignRole);

export default router;
