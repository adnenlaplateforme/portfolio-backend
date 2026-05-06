import type { Request, Response } from 'express';
import { sendEmail } from '../services/email.service.js';

export const sendSimpleEmail = async (req: Request, res: Response) => {
  const { to, subject, html } = req.body;
  await sendEmail({ to, subject, html });
  res.status(200).json({ message: 'Email envoyé avec succès' });
};
