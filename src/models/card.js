import 'dotenv/config.js';
import prisma from '../db.js';
import getLogger from '../utils/logger.js';

const logger = getLogger();

export default class Card {

  /**
   * @description Create a new card
   * @param {number} userId - User's id
   * @param {string} word - Word
   * @param {object} attributes - Card's attributes
   * @returns {object|null} Created card data
   */
  async create(userId, word, attributes = {}) {
    let result;
    try {
      result = await prisma.card.create({
        data: {
          userId,
          word,
          attributes,
        },
      });
    } catch (error) {
      logger.error(
        '[models/card/create] ' +
        'Failed to create a new card: ' +
        `userId = ${userId}, word = ${word}, attributes = ${JSON.stringify(attributes)}, ` +
        `error = ${error}`
      );
      result = null;
    }
    return result;
  }

  /**
   * @description Get card data
   * @param {number} cardId - Card's id
   * @returns {object|null}
   */
  async get(cardId) {
    let result;
    try {
      result = await prisma.card.findUnique({
        where: { id: cardId },
        select: {
          id: true,
          word: true,
          status: true,
          attributes: true,
          nextDate: true,
        },
      });
      if (result === null) result = undefined;
    } catch (error) {
      logger.error(
        '[models/card/getData] ' +
        'Failed to get card data: ' +
        `cardId = ${cardId}, error = ${error}`
      );
      result = null;
    }
    return result;
  }

  /**
   * @description Update card data
   * @param {number} cardId - Card's id
   * @param {string} word - Word
   * @param {object} attributes - Card's attributes
   * @param {string} status - Card's status
   * @param {Date} nextDate - Card's next date
   * @returns {object|null}
   */
  async update(cardId, word, attributes, status, nextDate) {
    let result;
    try {
      result = await prisma.card.update({
        where: { id: cardId },
        data: { word, attributes, status, nextDate, modifiedAt: new Date() },
      });
    } catch (error) {
      logger.error(
        '[models/card/update] ' +
        'Failed to update card data: ' +
        `cardId = ${cardId}, word = ${word}, attributes = ${JSON.stringify(attributes)}, ` +
        `status = ${status}, nextDate = ${nextDate}, error = ${error}`
      );
      result = null;
    }
    return result;
  }

  /**
   * @description Delete card
   * @param {number} cardId - Card's id
   * @returns {object|null}
   */
  async delete(cardId) {
    let result;
    try {
      result = await prisma.card.delete({
        where: { id: cardId },
      });
    } catch (error) {
      logger.error(
        '[models/card/delete] ' +
        'Failed to delete card: ' +
        `cardId = ${cardId}, error = ${error}`
      );
      result = null;
    }
    return result;
  }

  /**
   * @description Get cards for practice
   * @param  {number} userId
   * @param  {number} countCard
   * @param  {number} currentDay
   * @returns {array of object|null}
   */
  async getPractice(userId, countCard, currentDay) {
    let result;

    const select = {
      id: true,
      word: true,
      attributes: true,
      status: true,
      nextDate: true,
    };

    try {
      // получим карточки со статусом new 
      const newCards = await prisma.card.findMany({
        where: {
          userId,
          status: 'new',
        },
        select,
      });

      // получим relearning карточки
      const relearningCards = await prisma.card.findMany({
        where: {
          userId,
          status: 'relearning',
        },
        select,
      });

      // получим inactive карточки
      let inactiveCards;
      if (newCards.length < countCard) {
        inactiveCards = await prisma.card.findMany({
          where: {
            userId,
            status: 'inactive',
          },
          select,
          take: countCard - newCards.length,
        });
      }

      // получим review карточки, у которых которых сегодня nextDate или уже прошла
      const reviewCards = await prisma.card.findMany({
        where: {
          userId,
          status: 'review',
          nextDate: {
            lte: currentDay,
          },
        },
        select,
      });
      result = [...newCards, ...relearningCards, ...inactiveCards, ...reviewCards];
    } catch (error) {
      logger.error(
        '[models/card/createQueue] ' +
        'Failed to create queue: ' +
        `userId = ${userId}, countCard = ${countCard}, currentDay = ${currentDay}, ` +
        `error = ${error}`
      );
      result = null;
    }
    return result;
  }
}
