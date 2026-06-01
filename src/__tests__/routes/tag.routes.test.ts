import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

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

import * as tagService from '../../services/tag.service.js';
import AppError from '../../errors/AppError.js';
import app from '../../app.js';

const JWT_SECRET = 'test-secret';
let adminToken: string;

const mockTag = { id: 1, name: 'react' };

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
  adminToken = jwt.sign({ id: 1, email: 'admin@test.com', role: 'admin' }, JWT_SECRET);
});

describe('GET /api/tags', () => {
  it('retourne 200 avec la liste des tags', async () => {
    vi.mocked(tagService.getAllTags).mockResolvedValue([mockTag] as any);

    const res = await request(app).get('/api/tags');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockTag]);
  });
});

describe('GET /api/tags/:id', () => {
  it('retourne 200 avec le tag', async () => {
    vi.mocked(tagService.getTagById).mockResolvedValue(mockTag as any);

    const res = await request(app).get('/api/tags/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTag);
  });

  it('retourne 404 si le tag n\'existe pas', async () => {
    vi.mocked(tagService.getTagById).mockRejectedValue(new AppError('Tag introuvable', 404));

    const res = await request(app).get('/api/tags/99');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Tag introuvable');
  });

  it('retourne 400 si l\'id est invalide', async () => {
    const res = await request(app).get('/api/tags/abc');
    expect(res.status).toBe(400);
  });
});

describe('POST /api/tags', () => {
  it('retourne 401 sans token', async () => {
    const res = await request(app).post('/api/tags').send({ name: 'react' });
    expect(res.status).toBe(401);
  });

  it('retourne 201 avec un token admin valide', async () => {
    vi.mocked(tagService.createTag).mockResolvedValue(mockTag as any);

    const res = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'react' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockTag);
  });

  it('retourne 400 si le nom est manquant', async () => {
    const res = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/tags/:id', () => {
  it('retourne 401 sans token', async () => {
    const res = await request(app).put('/api/tags/1').send({ name: 'vue' });
    expect(res.status).toBe(401);
  });

  it('retourne 200 avec un token admin valide', async () => {
    vi.mocked(tagService.updateTag).mockResolvedValue(mockTag as any);

    const res = await request(app)
      .put('/api/tags/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'vue' });

    expect(res.status).toBe(200);
  });

  it('retourne 400 si l\'id est invalide', async () => {
    const res = await request(app)
      .put('/api/tags/abc')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'vue' });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/tags/:id', () => {
  it('retourne 401 sans token', async () => {
    const res = await request(app).delete('/api/tags/1');
    expect(res.status).toBe(401);
  });

  it('retourne 204 avec un token admin valide', async () => {
    vi.mocked(tagService.deleteTag).mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/tags/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(204);
  });

  it('retourne 404 si le tag n\'existe pas', async () => {
    vi.mocked(tagService.deleteTag).mockRejectedValue(new AppError('Tag introuvable', 404));

    const res = await request(app)
      .delete('/api/tags/99')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it('retourne 400 si l\'id est invalide', async () => {
    const res = await request(app)
      .delete('/api/tags/abc')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
  });
});
