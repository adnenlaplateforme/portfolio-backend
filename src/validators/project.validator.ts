import { body, param } from 'express-validator';

export const validateProjectById = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
];

export const validateProjectIds = [
  body('ids')
    .isArray({ min: 1 }).withMessage('ids doit être un tableau non vide')
    .custom((arr: unknown[]) => arr.every(id => Number.isInteger(id) && (id as number) > 0))
    .withMessage('ids doit contenir des entiers positifs'),
];

const tagIdsValidator = body('tag_ids')
  .optional()
  .customSanitizer(val => {
    if (val === undefined || val === null || val === '') return undefined;
    let parsed = val;
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed); } catch { /* garde la valeur brute */ }
    }
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    return arr.map(Number).filter((n: number) => Number.isInteger(n) && n > 0);
  });

export const validateProject = [
  body('title').notEmpty().withMessage('Titre requis').isLength({ max: 150 }).withMessage('Titre trop long').isLength({min: 3}).withMessage('Titre trop court'),
  body('description').optional().isString(),
  body('github_url').optional().isURL().withMessage('URL GitHub invalide'),
  body('demo_url').optional().isURL().withMessage('URL démo invalide'),
  body('image_url').optional().isURL().withMessage('URL image invalide'),
  tagIdsValidator,
];

export const updateProjectValidator = [
  body('title').optional().notEmpty().withMessage('Titre requis').isLength({ min: 3 }).withMessage('Titre trop court').isLength({ max: 150 }).withMessage('Titre trop long'),
  body('description').optional().isString(),
  body('github_url').optional().isURL().withMessage('URL GitHub invalide'),
  body('demo_url').optional().isURL().withMessage('URL démo invalide'),
  body('image_url').optional().isURL().withMessage('URL image invalide'),
  tagIdsValidator,
];