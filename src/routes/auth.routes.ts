import { Router } from 'express';
import { loginValidator } from '../validators/auth.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { login } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginValidator, validate, login);

export default router;
