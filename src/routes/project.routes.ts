import { Router } from 'express';
import { getAllProjects, getProjectById } from '../controllers/project.controller.ts';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);

export default router;
