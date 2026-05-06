import { Router } from 'express';
import { sendSimpleEmail } from '../controllers/email.controller.js';

const router = Router();

router.post('/send', sendSimpleEmail);

export default router;
