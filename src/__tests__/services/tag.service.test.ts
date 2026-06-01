import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../models/tag.model.js', () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  removeMany: vi.fn(),
}));

import * as tagModel from '../../models/tag.model.js';
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  deleteTags,
} from '../../services/tag.service.js';

const mockTag = { id: 1, name: 'react' } as any;

describe('tag.service', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getAllTags', () => {
    it('retourne la liste des tags', async () => {
      vi.mocked(tagModel.findAll).mockResolvedValue([mockTag]);
      const result = await getAllTags();
      expect(result).toEqual([mockTag]);
    });
  });

  describe('getTagById', () => {
    it('retourne le tag correspondant à l\'id', async () => {
      vi.mocked(tagModel.findById).mockResolvedValue(mockTag);
      const result = await getTagById(1);
      expect(result).toEqual(mockTag);
      expect(tagModel.findById).toHaveBeenCalledWith(1);
    });

    it('lève une AppError 404 si le tag n\'existe pas', async () => {
      vi.mocked(tagModel.findById).mockResolvedValue(null);
      await expect(getTagById(99)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('createTag', () => {
    it('crée un tag et retourne l\'objet créé', async () => {
      vi.mocked(tagModel.create).mockResolvedValue(1);
      vi.mocked(tagModel.findById).mockResolvedValue(mockTag);

      const result = await createTag({ name: 'react' });

      expect(result).toEqual(mockTag);
      expect(tagModel.create).toHaveBeenCalledWith({ name: 'react' });
      expect(tagModel.findById).toHaveBeenCalledWith(1);
    });

    it('lève une AppError 409 si le tag existe déjà', async () => {
      vi.mocked(tagModel.create).mockRejectedValue({ code: 'ER_DUP_ENTRY' });
      await expect(createTag({ name: 'react' })).rejects.toMatchObject({ status: 409 });
    });
  });

  describe('updateTag', () => {
    it('retourne le tag mis à jour', async () => {
      vi.mocked(tagModel.findById).mockResolvedValue(mockTag);
      vi.mocked(tagModel.update).mockResolvedValue({ ...mockTag, name: 'vue' } as any);

      const result = await updateTag(1, { name: 'vue' });
      expect(tagModel.update).toHaveBeenCalledWith(1, { name: 'vue' });
      expect(result).toEqual({ ...mockTag, name: 'vue' });
    });

    it('lève une AppError 404 si le tag n\'existe pas', async () => {
      vi.mocked(tagModel.findById).mockResolvedValue(null);
      await expect(updateTag(99, { name: 'vue' })).rejects.toMatchObject({ status: 404 });
    });

    it('lève une AppError 409 si le nouveau nom est déjà pris', async () => {
      vi.mocked(tagModel.findById).mockResolvedValue(mockTag);
      vi.mocked(tagModel.update).mockRejectedValue({ code: 'ER_DUP_ENTRY' });
      await expect(updateTag(1, { name: 'vue' })).rejects.toMatchObject({ status: 409 });
    });
  });
  
  describe('deleteTag', () => {
    it('se résout sans valeur si suppression réussie', async () => {
      vi.mocked(tagModel.findById).mockResolvedValue(mockTag);
      vi.mocked(tagModel.remove).mockResolvedValue(true);
      await expect(deleteTag(1)).resolves.toBeUndefined();
    });

    it('lève une AppError 404 si le tag n\'existe pas', async () => {
      vi.mocked(tagModel.findById).mockResolvedValue(null);
      await expect(deleteTag(99)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('deleteTags', () => {
    it('appelle removeMany avec les ids', async () => {
      vi.mocked(tagModel.removeMany).mockResolvedValue(undefined);
      await expect(deleteTags([1, 2])).resolves.toBeUndefined();
      expect(tagModel.removeMany).toHaveBeenCalledWith([1, 2]);
    });
  });
});