import { Router } from 'express';
import { getAllTags, getTagById, createTag, updateTag, deleteTag } from '../controllers/tag.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import { validateTagById, validateTag, updateTagValidator } from '../validators/tag.validator.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

router.get('/', getAllTags);
router.get('/:id', validateTagById, validate, getTagById);
router.post('/', authenticate, authorize('admin'), validateTag, validate, createTag);
router.put('/:id', authenticate, authorize('admin'), validateTagById, updateTagValidator, validate, updateTag);
router.delete('/:id', authenticate, authorize('admin'), validateTagById, validate, deleteTag);

export default router;
