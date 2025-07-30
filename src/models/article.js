import 'dotenv/config.js';
import prisma from '../db.js';
import { getLogger } from '../utils/logger.js';

const logger = getLogger();

export default class Article {
  /**
   * @description Create a new article
   * @param {string} title
   * @param {string} content
   * @param {string} slug
   * @param {string[]} tags
   * @returns {object|null} Created article data
   */
  async create(title, content, slug, tags = []) {
    let result;
    try {
      result = await prisma.article.create({
        data: {
          title,
          content,
          slug,
          tags,
        },
      });
    } catch (error) {
      logger.error(
        '[models/article/create] ' +
          'Failed to create a new article: ' +
          `title = ${title}, content = ${content}, slug = ${slug}, tags = ${JSON.stringify(
            tags
          )}, ` +
          `error = ${error}`
      );
      result = null;
    }
    return result;
  }

  /**
   * @description Get article data
   * @param {number} articleId - Article's id
   * @returns {object|null|undefined}
   */
  async get(articleId) {
    let result;
    try {
      // either article or null
      result = await prisma.article.findUnique({
        where: { id: articleId },
        select: {
          id: true,
          title: true,
          content: true,
          tags: true,
        },
      });
    } catch (error) {
      logger.error(
        '[models/article/getData] ' +
          'Failed to get article data: ' +
          `articleId = ${articleId}, error = ${error}`
      );
      result = undefined;
    }
    return result;
  }
}
