import { findAll } from '../models/project.model.ts';

export const getAllProjects = async () => {
  return findAll();
};
