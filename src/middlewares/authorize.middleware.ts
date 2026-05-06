import type { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError.js';

const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }
    next();
  };
};

export default authorize;
