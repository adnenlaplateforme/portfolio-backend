import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../models/project.model.js', () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('../../services/storage.service.js', () => ({
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
}));

import * as projectModel from '../../models/project.model.js';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../../services/project.service.js';

const mockProject = {
  id: 1,
  title: 'Mon projet',
  description: null,
  tech_stack: 'Node.js',
  github_url: null,
  demo_url: null,
  image_url: null,
} as any;

describe('project.service', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getAllProjects', () => {
    it('retourne la liste des projets', async () => {
      vi.mocked(projectModel.findAll).mockResolvedValue([mockProject]);
      const result = await getAllProjects();
      expect(result).toEqual([mockProject]);
    });
  });

  describe('getProjectById', () => {
    it("retourne le projet correspondant à l'id", async () => {
      vi.mocked(projectModel.findById).mockResolvedValue(mockProject);
      const result = await getProjectById(1);
      expect(result).toEqual(mockProject);
      expect(projectModel.findById).toHaveBeenCalledWith(1);
    });

    it("lève une AppError 404 si le projet n'existe pas", async () => {
      vi.mocked(projectModel.findById).mockResolvedValue(null);
      await expect(getProjectById(99)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('createProject', () => {
    it("crée un projet et retourne l'objet créé", async () => {
      vi.mocked(projectModel.create).mockResolvedValue(1);
      vi.mocked(projectModel.findById).mockResolvedValue(mockProject);

      const result = await createProject({ title: 'Mon projet' } as any);

      expect(result).toEqual(mockProject);
      expect(projectModel.create).toHaveBeenCalledWith({ title: 'Mon projet' });
      expect(projectModel.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateProject', () => {
    it('retourne le projet mis à jour', async () => {
      vi.mocked(projectModel.findById).mockResolvedValue(mockProject);
      vi.mocked(projectModel.update).mockResolvedValue(mockProject);
      const result = await updateProject(1, { title: 'Modifié' } as any);
      expect(result).toEqual(mockProject);
    });

    it('ne modifie pas les champs absents du body', async () => {
      vi.mocked(projectModel.findById).mockResolvedValue(mockProject);
      vi.mocked(projectModel.update).mockResolvedValue(mockProject);
      await updateProject(1, { title: 'Modifié' } as any);
      expect(projectModel.update).toHaveBeenCalledWith(1, expect.objectContaining({
        tech_stack: mockProject.tech_stack,
        github_url: mockProject.github_url,
      }));
    });

    it("lève une AppError 404 si le projet n'existe pas", async () => {
      vi.mocked(projectModel.findById).mockResolvedValue(null);
      await expect(updateProject(99, { title: 'X' } as any)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('deleteProject', () => {
    it('se résout sans valeur si suppression réussie', async () => {
      vi.mocked(projectModel.findById).mockResolvedValue(mockProject);
      vi.mocked(projectModel.remove).mockResolvedValue(true);
      await expect(deleteProject(1)).resolves.toBeUndefined();
    });

    it("lève une AppError 404 si le projet n'existe pas", async () => {
      vi.mocked(projectModel.findById).mockResolvedValue(null);
      await expect(deleteProject(99)).rejects.toMatchObject({ status: 404 });
    });
  });
});
