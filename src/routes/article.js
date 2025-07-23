import { Router } from 'express';
import { createArticle } from '../controllers/article.js';
import { createArticleValidator } from '../validators/article.js';
import { runValidation } from '../validators/index.js';

const articlesRouter = Router();

articlesRouter.post('/', createArticleValidator, runValidation, createArticle);

export default articlesRouter;
