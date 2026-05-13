import type { Request, Response } from 'express';
import * as EmailService from '../services/email.service.js';

export const sendSimpleEmail = async (req: Request, res: Response) => {
  const { to, subject, html } = req.body;
  await EmailService.sendEmail({ to, subject, html });
  res.status(200).json({ message: 'Email envoyé avec succès' });
};
