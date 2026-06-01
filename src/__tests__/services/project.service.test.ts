import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../models/project.model.js', () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  findManyByIds: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  removeMany: vi.fn(),
}));

vi.mock('../../services/storage.service.js', () => ({
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
}));

import * as projectModel from '../../models/project.model.js';
import * as storageService from '../../services/storage.service.js';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteProjects,
} from '../../services/project.service.js';

const mockProject = {
  id: 1,
  title: 'Mon projet',
  description: null,
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

  describe('deleteProjects', () => {
    it('supprime les projets et leurs images Cloudinary', async () => {
      const projects = [
        { id: 1, image_key: 'key1' },
        { id: 2, image_key: null },
      ];
      vi.mocked(projectModel.findManyByIds).mockResolvedValue(projects as any);
      vi.mocked(projectModel.removeMany).mockResolvedValue(undefined);

      await expect(deleteProjects([1, 2])).resolves.toBeUndefined();

      expect(projectModel.findManyByIds).toHaveBeenCalledWith([1, 2]);
      expect(storageService.deleteImage).toHaveBeenCalledTimes(1);
      expect(storageService.deleteImage).toHaveBeenCalledWith('key1');
      expect(projectModel.removeMany).toHaveBeenCalledWith([1, 2]);
    });

    it('ne supprime aucune image si aucun projet n\'en a', async () => {
      vi.mocked(projectModel.findManyByIds).mockResolvedValue([{ id: 1, image_key: null }] as any);
      vi.mocked(projectModel.removeMany).mockResolvedValue(undefined);

      await deleteProjects([1]);

      expect(storageService.deleteImage).not.toHaveBeenCalled();
    });
  });
});
