import { findAll, findById, create } from '../models/project.model.ts';
import type { ProjectInput } from '../types/interfaces/project.interface.ts';
import AppError from '../errors/AppError.ts';

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
