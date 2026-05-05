import { Router } from 'express';
import { getAllProjects, getProjectById, createProject } from '../controllers/project.controller.ts';
import { authenticate } from '../middlewares/auth.middleware.ts';
import authorize from '../middlewares/authorize.middleware.ts';
import { validateProject } from '../validators/project.validator.ts';
import validate from '../middlewares/validate.middleware.ts';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', authenticate, authorize('admin'), validateProject, validate, createProject);

export default router;
