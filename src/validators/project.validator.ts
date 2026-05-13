import { body, param } from 'express-validator';

export const validateProjectById = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
];

export const validateProject = [
  body('title').notEmpty().withMessage('Titre requis').isLength({ max: 150 }).withMessage('Titre trop long').isLength({min: 3}).withMessage('Titre trop court'),
  body('description').optional().isString(),
  body('tech_stack').optional().isString(),
  body('github_url').optional().isURL().withMessage('URL GitHub invalide'),
  body('demo_url').optional().isURL().withMessage('URL démo invalide'),
  body('image_url').optional().isURL().withMessage('URL image invalide'),
];

export const updateProjectValidator = [
  body('title').optional().notEmpty().withMessage('Titre requis').isLength({ min: 3 }).withMessage('Titre trop court').isLength({ max: 150 }).withMessage('Titre trop long'),
  body('description').optional().isString(),
  body('tech_stack').optional().isString(),
  body('github_url').optional().isURL().withMessage('URL GitHub invalide'),
  body('demo_url').optional().isURL().withMessage('URL démo invalide'),
  body('image_url').optional().isURL().withMessage('URL image invalide'),
];