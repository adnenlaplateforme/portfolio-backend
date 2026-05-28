import * as ProjectModel from '../models/project.model.js';
import * as StorageService from './storage.service.js';
import type { ProjectInput } from '../types/interfaces/project.interface.js';
import AppError from '../errors/AppError.js';

export const getAllProjects = async () => {
  return ProjectModel.findAll();
};

export const getProjectById = async (id: number) => {
  const project = await ProjectModel.findById(id);
  if (!project) throw new AppError('Projet introuvable', 404);
  return project;
};

export const createProject = async (data: ProjectInput, file?: Express.Multer.File) => {
  if (file) {
    const { url, key } = await StorageService.uploadImage(file);
    data.image_url = url;
    data.image_key = key;
  }
  const insertId = await ProjectModel.create(data);
  return ProjectModel.findById(insertId);
};

export const updateProject = async (id: number, data: ProjectInput, file?: Express.Multer.File) => {
  const existing = await ProjectModel.findById(id);
  if (!existing) throw new AppError('Projet introuvable', 404);

  if (file) {
    if (existing.image_key) {
      await StorageService.deleteImage(existing.image_key);
    }
    const { url, key } = await StorageService.uploadImage(file);
    data.image_url = url;
    data.image_key = key;
  }

  const merged = { ...existing, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) };
  return ProjectModel.update(id, merged);
};

export const deleteProject = async (id: number) => {
  const project = await ProjectModel.findById(id);
  if (!project) throw new AppError('Projet introuvable', 404);

  if (project.image_key) {
    await StorageService.deleteImage(project.image_key);
  }

  await ProjectModel.remove(id);
};
