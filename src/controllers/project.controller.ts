import type { Request, Response } from 'express';
import { getAllProjects as getAllProjectsService } from '../services/project.service.ts';

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await getAllProjectsService();
  res.json(projects);
};
