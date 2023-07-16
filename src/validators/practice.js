import { check } from 'express-validator';

const getPracticeValidator = [
  check('practiceType').isIn(['daily']).withMessage('Invalid practice type'),
];

export {
  getPracticeValidator,
}
