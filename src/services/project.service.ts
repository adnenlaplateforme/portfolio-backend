import { findAll, findById } from '../models/project.model.ts';
import AppError from '../errors/AppError.ts';

export const getAllProjects = async () => {
  return findAll();
};

export const getProjectById = async (id: number) => {
  const project = await findById(id);
  if (!project) throw new AppError('Projet introuvable', 404);
  return project;
};
