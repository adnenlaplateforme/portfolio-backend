import { Router } from 'express';
import { getAllProjects, getProjectById, createProject } from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import { validateProject } from '../validators/project.validator.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', authenticate, authorize('admin'), validateProject, validate, createProject);

export default router;
