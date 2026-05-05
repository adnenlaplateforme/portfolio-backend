import type { Request, Response, NextFunction } from 'express';
import { getAllProjects as getAllProjectsService, getProjectById as getProjectByIdService, createProject as createProjectService } from '../services/project.service.ts';
import AppError from '../errors/AppError.ts';

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await getAllProjectsService();
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return next(new AppError('Projet introuvable', 404));
  const project = await getProjectByIdService(id);
  res.json(project);
};

export const createProject = async (req: Request, res: Response) => {
  const project = await createProjectService(req.body);
  res.status(201).json(project);
};
