import { check } from 'express-validator';

const createCardValidator = [
  check('word').not().isEmpty().withMessage('Word is required'),
  check('attributes').not().isEmpty().withMessage('Attributes is required'),
];

export {
  createCardValidator,
}
