import type { Request, Response } from 'express';
import * as ContactService from '../services/contact.service.js';

export const sendContactEmail = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  await ContactService.sendContact({ name, email, message });
  res.status(200).json({ message: 'Message envoyé avec succès' });
};
