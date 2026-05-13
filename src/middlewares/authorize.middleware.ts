import type { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError.js';

const authorize = (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new AppError('Action non autorisée', 403));
  }
  next();
};

export default authorize;
