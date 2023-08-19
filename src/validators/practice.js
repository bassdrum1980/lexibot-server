import { check } from 'express-validator';

const getPracticeValidator = [
  check('practiceType').isIn(['daily']).withMessage('Invalid practice type'),
];

const postPracticeValidator = [
  check('practiceType').isIn(['daily']).withMessage('Invalid practice type'),
  check('cardId').isInt({ gt: 0 }).withMessage('Invalid card id'),
  check('cardStatus').isIn(['new', 'relearning', 'inactive', 'review']).withMessage('Invalid card status'),
];

export {
  getPracticeValidator,
  postPracticeValidator,
}
