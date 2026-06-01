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

import * as contactService from '../../services/contact.service.js';
import app from '../../app.js';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
});

describe('POST /api/contact', () => {
  it('retourne 200 avec un formulaire valide', async () => {
    vi.mocked(contactService.sendContact).mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Alice', email: 'alice@test.com', message: 'Bonjour, je vous contacte !' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Message envoyé avec succès');
    expect(contactService.sendContact).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@test.com',
      message: 'Bonjour, je vous contacte !',
    });
  });

  it('retourne 400 si les champs sont manquants', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({});

    expect(res.status).toBe(400);
  });

  it('retourne 400 si le message est trop court (< 10 caractères)', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Alice', email: 'alice@test.com', message: 'Court' });

    expect(res.status).toBe(400);
  });

  it('retourne 400 si l\'email est invalide', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Alice', email: 'pas-un-email', message: 'Bonjour, je vous contacte !' });

    expect(res.status).toBe(400);
  });
});
