import { getLogger } from '../utils/logger.js';
import Article from '../models/article.js';

const logger = getLogger();

async function createArticle(req, res) {
  let responseStatus;
  let result;

  const { title, content, slug, tags } = req.body;
  logger.debug(
    '[contollers/article/postArticle] ' +
      `title = ${title}, content = ${content}, slug = ${slug}, tags = ${JSON.stringify(
        tags
      )}`
  );

  const article = new Article();
  const createdArticle = await article.create(title, content, slug, tags);
  if (createdArticle) {
    responseStatus = 200;
    result = { data: createdArticle };
  } else {
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

export { createArticle };
