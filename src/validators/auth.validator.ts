import { body } from 'express-validator';

export const loginValidator = [
  body('email').notEmpty().withMessage('Email requis').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis').isLength({ min: 8 }).withMessage('Mot de passe trop court'),
];
