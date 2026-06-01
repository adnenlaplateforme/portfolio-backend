import { describe, it, expect, vi, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';

const JWT_SECRET = 'test-secret';

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
});

const makeReq = (authHeader?: string) =>
  ({ headers: { authorization: authHeader } } as unknown as Request);

const res = {} as Response;

describe('authenticate middleware', () => {
  it('appelle next(AppError 401) si le header est absent', () => {
    const next = vi.fn() as unknown as NextFunction;
    authenticate(makeReq(), res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
  });

  it('appelle next(AppError 401) si le header ne commence pas par Bearer', () => {
    const next = vi.fn() as unknown as NextFunction;
    authenticate(makeReq('Basic abc'), res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
  });

  it('appelle next(AppError 401) si le token est invalide', () => {
    const next = vi.fn() as unknown as NextFunction;
    authenticate(makeReq('Bearer invalid.token.here'), res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
  });

  it('attache req.user et appelle next() si le token est valide', () => {
    const next = vi.fn() as unknown as NextFunction;
    const payload = { id: 1, email: 'admin@test.com', role: 'admin' };
    const token = jwt.sign(payload, JWT_SECRET);
    const req = makeReq(`Bearer ${token}`);

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect((req as any).user).toMatchObject(payload);
  });
});
