import 'dotenv/config.js';
import prisma from '../db.js';
import getLogger from '../utils/logger.js';

const logger = getLogger();

export default class User {
  #userId;

  constructor(userId) {
    this.#userId = userId;
  }

  /**
   * @description Create a new user
   * @param {string} name - User's name
   * @param {string} email - User's email
   * @param {string} hash - Hashed password
   * @param {object} attributes - User's attributes
   * @param {object} statistics - User's statistics
   * @param {string} salt - Salt value
   * @returns {object|null} Created user data
   */
  async create(name, email, hash, salt,
    attributes = {
      autoPlay: true,
      timezone: 0,
      newCardCount: process.env.DEFAULT_NEW_CARD_COUNT,
      newCardToday: 0,
      lastPracticeDate: null,
    },
    statistics = {}) {
    let result;
    try {
      result = await prisma.user.create({
        data: {
          name,
          email,
          hash,
          salt,
          attributes,
          statistics,
        },
      });
    } catch (error) {
      logger.error(
        '[models/user/create] ' +
        `Failed to create a new user: error = ${error}`
      );
      result = null;
    }
    return result;
  }

  /**
   * @description Get user data
   * @returns {object|null}
   */
  async get() {
    let result;
    try {
      result = await prisma.user.findUnique({
        where: {
          id: this.#userId,
        },
      });
    } catch (error) {
      logger.error(
        '[models/user/getData]' +
        `can't get user data: userId = ${this.#userId}, error = ${error}`);
      result = null;
    }
    return result;
  }

  /**
   * @description Update user data
   * @param {object} newData
   * @returns {object|null} Updated user data
   */
  async update(newData) {
    let result;
    try {
      result = await prisma.user.update({
        where: { id: this.#userId },
        data: newData,
      });
    } catch (error) {
      logger.error(
        '[models/user/update] '
        + 'Failed to update user data: '
        + `userId = ${this.#userId}, newData = ${JSON.stringify(newData)}, error = ${error}`
      );
      result = null;
    }
    return result;
  }

  /**
   * @description Update user attribute
   * @param  {object} newAttributes
   * @returns {object|null>}
   */
  async updateAttributes(newAttributes) {
    let result;
    try {
      const user = await prisma.user.findUnique({
        where: { id: this.#userId },
        select: { attributes: true },
      });
      const oldAttributes = user.attributes || {};
      const updatedAttributes = {
        ...oldAttributes,
        ...newAttributes,
      }
      result = await prisma.user.update({
        where: { id: this.#userId },
        data: { attributes: updatedAttributes },
      });
    } catch (error) {
      logger.error(
        '[models/user/setAttribute] '
        + 'Failed to set user attribute: '
        + `userId = ${this.#userId}, newAttributes = ${JSON.stringify(newAttributes)}, error = ${error}`);
      result = null;
    }
    return result;
  }
}
