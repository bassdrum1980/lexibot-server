import 'dotenv/config.js';
import prisma from '../db.js';
import { getLogger } from '../utils/logger.js';

const logger = getLogger();

export default class Practice {

  /**
   * @description Create a new record about card practice
   * @param {number} userId
   * @param {number} cardId
   * @param {string} cardStatus
   * @param {number} date
   * @returns {object|null} 
   */
  async create(userId, cardId, cardStatus, date) {
    let result;
    try {
      result = await prisma.practice.create({
        data: {
          userId,
          cardId,
          status: cardStatus,
          date,
        },
        select: {
          cardId: true,
          status: true,
          date: true,
        },
      });
    } catch (error) {
      logger.error(
        '[models/practice/create] ' +
        `userId = ${userId}, cardId = ${cardId}, cardStatus = ${cardStatus}, date = ${date}, ` +
        `error = ${error}`
      );
      result = null;
    }
    return result;
  }
}
