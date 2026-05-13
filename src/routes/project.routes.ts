import { Router } from 'express';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import { validateProject, updateProjectValidator, validateProjectById } from '../validators/project.validator.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', validateProjectById, validate, getProjectById);
router.post('/', authenticate, authorize('admin'), validateProject, validate, createProject);
router.put('/:id', authenticate, authorize('admin'), validateProjectById, updateProjectValidator, validate, updateProject);
router.delete('/:id', authenticate, authorize('admin'), validateProjectById, validate, deleteProject);

export default router;