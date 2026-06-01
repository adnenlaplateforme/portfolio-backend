import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';

vi.mock('../../services/auth.service.js', () => ({ loginUser: vi.fn() }));
vi.mock('../../services/project.service.js', () => ({
  getAllProjects: vi.fn(), getProjectById: vi.fn(), createProject: vi.fn(),
  updateProject: vi.fn(), deleteProject: vi.fn(),
}));
vi.mock('../../services/contact.service.js', () => ({ sendContact: vi.fn() }));
vi.mock('../../services/email.service.js', () => ({ sendEmail: vi.fn() }));
vi.mock('../../services/tag.service.js', () => ({
  getAllTags: vi.fn(), getTagById: vi.fn(),
  createTag: vi.fn(), updateTag: vi.fn(), deleteTag: vi.fn(),
}));

import * as authService from '../../services/auth.service.js';
import AppError from '../../errors/AppError.js';
import app from '../../app.js';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
});

describe('POST /api/auth/login', () => {
  it('retourne 200 et un token avec des credentials valides', async () => {
    vi.mocked(authService.loginUser).mockResolvedValue('jwt-token');

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: 'jwt-token' });
  });

  it('retourne 401 avec des credentials invalides', async () => {
    vi.mocked(authService.loginUser).mockRejectedValue(new AppError('Invalid credentials', 401));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'x@x.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('retourne 400 si les champs sont manquants', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });

  it('retourne 400 si l\'email est invalide', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'pas-un-email', password: 'password' });

    expect(res.status).toBe(400);
  });

  it('retourne 400 si le mot de passe est trop court', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'court' });

    expect(res.status).toBe(400);
  });
});
