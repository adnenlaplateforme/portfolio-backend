import type { Request, Response } from 'express';
import * as TagService from '../services/tag.service.js';

export const getAllTags = async (_req: Request, res: Response) => {
  const tags = await TagService.getAllTags();
  res.json(tags);
};

export const getTagById = async (req: Request, res: Response) => {
  const tag = await TagService.getTagById(Number(req.params.id));
  res.json(tag);
};

export const createTag = async (req: Request, res: Response) => {
  const tag = await TagService.createTag(req.body);
  res.status(201).json(tag);
};

export const updateTag = async (req: Request, res: Response) => {
  const tag = await TagService.updateTag(Number(req.params.id), req.body);
  res.json(tag);
};

export const deleteTag = async (req: Request, res: Response) => {
  await TagService.deleteTag(Number(req.params.id));
  res.status(204).send();
};
