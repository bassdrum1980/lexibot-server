import { getLogger } from '../utils/logger.js';
import Article from '../models/article.js';

const logger = getLogger();

async function createArticle(req, res) {
  let responseStatus;
  let result;

  const { title, content, slug, tags } = req.body.article;
  logger.debug(
    '[controllers/article/postArticle] ' +
      `title = ${title}, content = ${content}, slug = ${slug}, tags = ${JSON.stringify(
        tags
      )}`
  );

  const article = new Article();
  const createdArticle = await article.create(title, content, slug, tags);
  if (createdArticle) {
    responseStatus = 201;
    result = { data: createdArticle };
  } else {
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

async function getArticle(req, res) {
  let responseStatus;
  let result;

  const id = Number(req.params.id);
  logger.debug(`[controllers/article/getArticle] articleId = ${id}`);

  const article = new Article();
  const foundArticle = await article.get(id);
  if (foundArticle) {
    responseStatus = 200;
    result = { data: foundArticle };
  } else if (foundArticle === null) {
    responseStatus = 404;
    result = { error: 'Article not found' };
  } else {
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

export { getArticle, createArticle };
