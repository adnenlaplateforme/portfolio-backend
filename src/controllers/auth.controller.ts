import type { Request, Response } from 'express';
import * as AuthService from '../services/auth.service.js';

export const login = async (req: Request, res: Response) => {
  const token = await AuthService.loginUser(req.body);
  res.json({ token });
};
