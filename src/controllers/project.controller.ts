import type { Request, Response } from 'express';
import * as ProjectService from '../services/project.service.js';

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await ProjectService.getAllProjects();
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const {id} = req.params;
  const project = await ProjectService.getProjectById(Number(id));
  res.json(project);
};

export const createProject = async (req: Request, res: Response) => {
  const project = await ProjectService.createProject(req.body, req.file);
  res.status(201).json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await ProjectService.updateProject(Number(req.params.id), req.body, req.file);
  res.json(project);
};

export const deleteProject = async (req: Request, res: Response) => {
  await ProjectService.deleteProject(Number(req.params.id));
  res.status(204).send();
};
