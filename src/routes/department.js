import { Router } from 'express';
import middlewares from '../middlewares';
import permitUser from '../middlewares/permission';
import DepartmentController from '../controllers/departmentController';

const router = Router();
const { auth } = middlewares;
const { getDepartments, assignManager } = DepartmentController;

router.get('/', getDepartments);
router.patch('/manager', auth, permitUser(['super_admin']), assignManager);

export default router;
