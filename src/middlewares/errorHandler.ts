import type { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError.js';

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
