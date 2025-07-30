import { check } from 'express-validator';

const createArticleValidator = [
  check('article.title').not().isEmpty().withMessage('Title is required'),
  check('article.content').not().isEmpty().withMessage('Content is required'),
  check('article.slug').not().isEmpty().withMessage('Slug is required'),
  check('article.tags').isArray().withMessage('Tags must be an array'),
  check('article.tags.*').isString().withMessage('Each tag must be a string'),
];

export { createArticleValidator };
