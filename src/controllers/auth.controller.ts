import type { Request, Response } from 'express';
import { loginUser } from '../services/auth.service.js';

export const login = async (req: Request, res: Response) => {
  const token = await loginUser(req.body);
  res.json({ token });
};
