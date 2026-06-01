import { body, param } from 'express-validator';

export const validateTagById = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
];

export const validateTag = [
  body('name').notEmpty().withMessage('Nom requis').isLength({ max: 100 }).withMessage('Nom trop long'),
];

export const updateTagValidator = [
  body('name').notEmpty().withMessage('Nom requis').isLength({ max: 100 }).withMessage('Nom trop long'),
];
