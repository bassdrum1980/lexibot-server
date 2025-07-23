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
}
