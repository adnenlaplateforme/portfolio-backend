import type { Request, Response } from 'express';
import { loginUser } from '../services/auth.service.ts';

export const login = async (req: Request, res: Response) => {
  const token = await loginUser(req.body);
  res.json({ token });
};
