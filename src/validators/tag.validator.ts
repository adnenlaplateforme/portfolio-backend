import { body, param } from 'express-validator';

export const validateTagIds = [
  body('ids')
    .isArray({ min: 1 }).withMessage('ids doit être un tableau non vide')
    .custom((arr: unknown[]) => arr.every(id => Number.isInteger(id) && (id as number) > 0))
    .withMessage('ids doit contenir des entiers positifs'),
];

export const validateTagById = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
];

export const validateTag = [
  body('name').notEmpty().withMessage('Nom requis').isLength({ max: 100 }).withMessage('Nom trop long'),
];

export const updateTagValidator = [
  body('name').notEmpty().withMessage('Nom requis').isLength({ max: 100 }).withMessage('Nom trop long'),
];
