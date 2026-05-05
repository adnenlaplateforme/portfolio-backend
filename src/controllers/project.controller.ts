import type { Request, Response } from 'express';
import { getAllProjects as getAllProjectsService, getProjectById as getProjectByIdService } from '../services/project.service.ts';

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await getAllProjectsService();
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const project = await getProjectByIdService(Number(req.params.id));
  res.json(project);
};
