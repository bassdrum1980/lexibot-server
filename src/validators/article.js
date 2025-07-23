import { check } from 'express-validator';

const createArticleValidator = [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('content').not().isEmpty().withMessage('Content is required'),
  check('slug').not().isEmpty().withMessage('Slug is required'),
  check('tags').isArray().withMessage('Tags must be an array'),
  check('tags.*').isString().withMessage('Each tag must be a string'),
];

export { createArticleValidator };
