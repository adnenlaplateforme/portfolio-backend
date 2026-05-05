import { Router } from 'express';
import { loginValidator } from '../validators/auth.validator.ts';
import validate from '../middlewares/validate.middleware.ts';
import { login } from '../controllers/auth.controller.ts';

const router = Router();

router.post('/login', loginValidator, validate, login);

export default router;
