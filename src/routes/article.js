import { Router } from 'express';
import { createArticle, getArticle } from '../controllers/article.js';
import { createArticleValidator } from '../validators/article.js';
import { runValidation } from '../validators/index.js';

const articlesRouter = Router();

articlesRouter.post('/', createArticleValidator, runValidation, createArticle);
articlesRouter.get('/:id', getArticle);

export default articlesRouter;
