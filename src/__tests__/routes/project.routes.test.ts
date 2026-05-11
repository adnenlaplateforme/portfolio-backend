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

import * as projectService from '../../services/project.service.js';
import AppError from '../../errors/AppError.js';
import app from '../../app.js';

const JWT_SECRET = 'test-secret';
let adminToken: string;

const mockProject = {
  id: 1, title: 'Mon projet', description: null,
  tech_stack: 'Node.js', github_url: null, demo_url: null, image_url: null,
};

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
  adminToken = jwt.sign({ id: 1, email: 'admin@test.com', role: 'admin' }, JWT_SECRET);
});

describe('GET /api/projects', () => {
  it('retourne 200 avec la liste des projets', async () => {
    vi.mocked(projectService.getAllProjects).mockResolvedValue([mockProject] as any);

    const res = await request(app).get('/api/projects');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockProject]);
  });
});

describe('GET /api/projects/:id', () => {
  it('retourne 200 avec le projet', async () => {
    vi.mocked(projectService.getProjectById).mockResolvedValue(mockProject as any);

    const res = await request(app).get('/api/projects/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProject);
  });

  it('retourne 404 si le projet n\'existe pas', async () => {
    vi.mocked(projectService.getProjectById).mockRejectedValue(new AppError('Projet introuvable', 404));

    const res = await request(app).get('/api/projects/99');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Projet introuvable');
  });
});

describe('POST /api/projects', () => {
  it('retourne 401 sans token', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ title: 'Test' });

    expect(res.status).toBe(401);
  });

  it('retourne 201 avec un token admin valide', async () => {
    vi.mocked(projectService.createProject).mockResolvedValue(mockProject as any);

    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Mon projet' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockProject);
  });

  it('retourne 400 si le titre est manquant', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/projects/:id', () => {
  it('retourne 401 sans token', async () => {
    const res = await request(app)
      .put('/api/projects/1')
      .send({ title: 'Modifié' });

    expect(res.status).toBe(401);
  });

  it('retourne 200 avec un token admin valide', async () => {
    vi.mocked(projectService.updateProject).mockResolvedValue(mockProject as any);

    const res = await request(app)
      .put('/api/projects/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Modifié' });

    expect(res.status).toBe(200);
  });
});

describe('DELETE /api/projects/:id', () => {
  it('retourne 401 sans token', async () => {
    const res = await request(app).delete('/api/projects/1');

    expect(res.status).toBe(401);
  });

  it('retourne 204 avec un token admin valide', async () => {
    vi.mocked(projectService.deleteProject).mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/projects/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(204);
  });

  it('retourne 404 si le projet n\'existe pas', async () => {
    vi.mocked(projectService.deleteProject).mockRejectedValue(new AppError('Projet introuvable', 404));

    const res = await request(app)
      .delete('/api/projects/99')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
