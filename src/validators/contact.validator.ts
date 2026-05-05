import { body } from 'express-validator';

export const validateContact = [
  body('name').notEmpty().withMessage('Nom requis').isString().isLength({ min: 2 }).withMessage('Nom trop court').isLength({ max: 100 }).withMessage('Nom trop long'),
  body('email').notEmpty().withMessage('Email requis').isEmail().withMessage('Email invalide'),
  body('message').notEmpty().withMessage('Message requis').isString().isLength({ min: 10 }).withMessage('Message trop court').isLength({ max: 2000 }).withMessage('Message trop long'),
];
