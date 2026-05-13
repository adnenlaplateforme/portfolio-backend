import * as ProjectModel from '../models/project.model.js';
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

export const createProject = async (data: ProjectInput) => {
  const insertId = await ProjectModel.create(data);
  return ProjectModel.findById(insertId);
};

export const updateProject = async (id: number, data: ProjectInput) => {
  const existing = await ProjectModel.findById(id);
  if (!existing) throw new AppError('Projet introuvable', 404);
  const merged = { ...existing, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) };
  return ProjectModel.update(id, merged);
};

export const deleteProject = async (id: number) => {
  const deleted = await ProjectModel.remove(id);
  if (!deleted) throw new AppError('Projet introuvable', 404);
};
