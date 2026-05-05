import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError.ts';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token manquant', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = payload as Express.Request['user'];
    next();
  } catch {
    next(new AppError('Token invalide', 401));
  }
};
