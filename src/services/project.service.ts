import { findAll, findById, create, update } from '../models/project.model.js';
import type { ProjectInput } from '../types/interfaces/project.interface.js';
import AppError from '../errors/AppError.js';

export const getAllProjects = async () => {
  return findAll();
};

export const getProjectById = async (id: number) => {
  const project = await findById(id);
  if (!project) throw new AppError('Projet introuvable', 404);
  return project;
};

export const createProject = async (data: ProjectInput) => {
  const insertId = await create(data);
  return findById(insertId);
};

export const updateProject = async (id: number, data: ProjectInput) => {
  const project = await update(id, data);
  if (!project) throw new AppError('Projet introuvable', 404);
  return project;
};
