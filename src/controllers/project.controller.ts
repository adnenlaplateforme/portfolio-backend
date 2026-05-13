import type { Request, Response } from 'express';
import { getAllProjects as getAllProjectsService, getProjectById as getProjectByIdService, createProject as createProjectService, updateProject as updateProjectService, deleteProject as deleteProjectService } from '../services/project.service.js';

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await getAllProjectsService();
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const project = await getProjectByIdService(Number(req.params.id));
  res.json(project);
};

export const createProject = async (req: Request, res: Response) => {
  const project = await createProjectService(req.body);
  res.status(201).json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await updateProjectService(Number(req.params.id), req.body);
  res.json(project);
};

export const deleteProject = async (req: Request, res: Response) => {
  await deleteProjectService(Number(req.params.id));
  res.status(204).send();
};
