import { Router } from 'express';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, deleteProjects } from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import { validateProject, updateProjectValidator, validateProjectById, validateProjectIds } from '../validators/project.validator.js';
import validate from '../middlewares/validate.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', validateProjectById, validate, getProjectById);
router.post('/', authenticate, authorize('admin'), upload.single('image'), validateProject, validate, createProject);
router.put('/:id', authenticate, authorize('admin'), validateProjectById, upload.single('image'), updateProjectValidator, validate, updateProject);
router.delete('/', authenticate, authorize('admin'), validateProjectIds, validate, deleteProjects);
router.delete('/:id', authenticate, authorize('admin'), validateProjectById, validate, deleteProject);

export default router;