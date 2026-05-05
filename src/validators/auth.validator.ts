import { body } from 'express-validator';

export const loginValidator = [
  body('email').notEmpty().withMessage('Email requis').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
];
