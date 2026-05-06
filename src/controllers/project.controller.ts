import type { Request, Response } from 'express';
import { getAllProjects as getAllProjectsService, getProjectById as getProjectByIdService, createProject as createProjectService, updateProject as updateProjectService } from '../services/project.service.js';
import AppError from '../errors/AppError.js';

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await getAllProjectsService();
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new AppError('Projet introuvable', 404);
  const project = await getProjectByIdService(id);
  res.json(project);
};

export const createProject = async (req: Request, res: Response) => {
  const project = await createProjectService(req.body);
  res.status(201).json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new AppError('Projet introuvable', 404);
  const project = await updateProjectService(id, req.body);
  res.json(project);
};
