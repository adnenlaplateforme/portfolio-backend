import { body } from 'express-validator';

export const createProjectValidator = [
  body('title').notEmpty().withMessage('Titre requis').isString().isLength({ min: 2 }).withMessage('Titre trop court').isLength({ max: 150 }).withMessage('Titre trop long'),
  body('description').optional().isString().isLength({ max: 2000 }).withMessage('Description trop longue'),
  body('tech_stack').optional().isString().isLength({ max: 255 }).withMessage('Tech stack trop long'),
  body('github_url').optional().isURL().withMessage('URL GitHub invalide'),
  body('demo_url').optional().isURL().withMessage('URL démo invalide'),
  body('image_url').optional().isURL().withMessage('URL image invalide'),
];

export const updateProjectValidator = [
  body('title').optional().notEmpty().withMessage('Titre requis').isString().isLength({ min: 2 }).withMessage('Titre trop court').isLength({ max: 150 }).withMessage('Titre trop long'),
  body('description').optional().isString().isLength({ max: 2000 }).withMessage('Description trop longue'),
  body('tech_stack').optional().isString().isLength({ max: 255 }).withMessage('Tech stack trop long'),
  body('github_url').optional().isURL().withMessage('URL GitHub invalide'),
  body('demo_url').optional().isURL().withMessage('URL démo invalide'),
  body('image_url').optional().isURL().withMessage('URL image invalide'),
];
