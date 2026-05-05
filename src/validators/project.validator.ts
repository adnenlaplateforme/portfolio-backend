import { body } from 'express-validator';

export const validateProject = [
  body('title').notEmpty().withMessage('Titre requis').isLength({ max: 150 }).withMessage('Titre trop long').isLength({min: 3}).withMessage('Titre trop court'),
  body('description').optional().isString(),
  body('tech_stack').optional().isString(),
  body('github_url').optional().isURL().withMessage('URL GitHub invalide'),
  body('demo_url').optional().isURL().withMessage('URL démo invalide'),
  body('image_url').optional().isURL().withMessage('URL image invalide'),
];