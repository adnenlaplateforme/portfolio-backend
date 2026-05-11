import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../models/user.model.js', () => ({ findByEmail: vi.fn() }));
vi.mock('bcrypt', () => ({ default: { compare: vi.fn() } }));
vi.mock('jsonwebtoken', () => ({ default: { sign: vi.fn() } }));

import * as userModel from '../../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginUser } from '../../services/auth.service.js';

const mockUser = { id: 1, email: 'admin@test.com', password: 'hashed', role: 'admin' } as any;

describe('loginUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('retourne un token avec des credentials valides', async () => {
    vi.mocked(userModel.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(jwt.sign).mockReturnValue('jwt-token' as any);

    const token = await loginUser({ email: 'admin@test.com', password: 'secret' });

    expect(token).toBe('jwt-token');
    expect(userModel.findByEmail).toHaveBeenCalledWith('admin@test.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('secret', 'hashed');
  });

  it('lève une AppError 401 si l\'utilisateur n\'existe pas', async () => {
    vi.mocked(userModel.findByEmail).mockResolvedValue(null);

    await expect(loginUser({ email: 'inconnu@test.com', password: 'x' }))
      .rejects.toMatchObject({ status: 401, message: 'Invalid credentials' });
  });

  it('lève une AppError 401 si le mot de passe est incorrect', async () => {
    vi.mocked(userModel.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(loginUser({ email: 'admin@test.com', password: 'mauvais' }))
      .rejects.toMatchObject({ status: 401, message: 'Invalid credentials' });
  });
});
