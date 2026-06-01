import * as TagModel from '../models/tag.model.js';
import type { TagInput } from '../types/interfaces/tag.interface.js';
import AppError from '../errors/AppError.js';

export const getAllTags = async () => {
  return TagModel.findAll();
};

export const getTagById = async (id: number) => {
  const tag = await TagModel.findById(id);
  if (!tag) throw new AppError('Tag introuvable', 404);
  return tag;
};

export const createTag = async (data: TagInput) => {
  const insertId = await TagModel.create(data);
  return TagModel.findById(insertId);
};

export const updateTag = async (id: number, data: TagInput) => {
  const existing = await TagModel.findById(id);
  if (!existing) throw new AppError('Tag introuvable', 404);
  return TagModel.update(id, data);
};

export const deleteTag = async (id: number) => {
  const tag = await TagModel.findById(id);
  if (!tag) throw new AppError('Tag introuvable', 404);
  await TagModel.remove(id);
};
