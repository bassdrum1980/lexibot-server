import { getLogger } from '../utils/logger.js';
import User from '../models/user.js';
import Card from '../models/card.js';
import Practice from '../models/practice.js';
import { getDay } from '../utils/funDay.js';

const logger = getLogger();

// ТОДО добавить try catch 
async function getPractice(req, res) {
  let result;

  const userId = req.user.id;
  const practiceType = req.params.practiceType;
  logger.debug(
    '[contollers/practice/getPractice] ' +
    `userId = ${userId}, practiceType = ${practiceType}`,
  );

  if (practiceType === 'daily') {
    result = await practiceDaily(userId);
  }

  return res.status(result.responseStatus).json(result.response);
}

async function practiceDaily(userId) {
  let responseStatus;
  let response;

  const user = new User(userId);
  const userData = await user.get();
  if (userData === null || userData.attributes?.timezone === undefined) {
    responseStatus = 500;
    response = { error: 'Server error' };
    return {
      responseStatus,
      response,
    };
  }

  // получим текущий день клиента в формате yymmdd
  const currentDay = getDay(userData.attributes.timezone);

  // определим, первая ли тренировка это на сегодня
  const firstTrain = (userData.attributes.lastPracticeDate === currentDay) ? false : true;

  // если сегодня это первая тренировка, то обнулим число тренированных за сегодня новых карточек
  if (firstTrain) {
    const ifUpdated = await user.updateAttributes({ newCardToday: 0 });
    if (!ifUpdated) {
      responseStatus = 500;
      response = { error: 'Server error' };
      return {
        responseStatus,
        response,
      };
    }
  }

  // определим сколько карточек new + inactive планируется к показу
  const countCard = (firstTrain) ?
    userData.attributes.newCardCount :
    userData.attributes.newCardCount - userData.attributes.newCardToday;

  const card = new Card();
  const foundCards = await card.getPractice(userId, countCard, currentDay);
  if (foundCards) {
    responseStatus = 200;
    response = { data: foundCards };
  } else {
    responseStatus = 500;
    response = { error: 'Server error' };
  }

  return {
    responseStatus,
    response,
  };
}

/**
 * @description 
 * @param {object} req
 * @param {object} res
 * @returns {object} result
 */
async function postPractice(req, res) {
  let result;

  try {
    const userId = req.user.id;
    const { practiceType } = req.params;
    const { cardId, cardStatus } = req.body;
    logger.debug(
      '[contollers/practice/postPractice] ' +
      `userId = ${userId}, practiceType = ${practiceType}, cardId = ${cardId}, cardStatus = ${cardStatus}`,
    );
    if (practiceType === 'daily') {
      result = await gradeCard(userId, cardId, cardStatus);
      if (result === null) throw new Error('Failed to grade card');
      result = {
        responseStatus: 200,
        response: { data: result },
      }
    } else {
      result = {
        responseStatus: 400,
        response: { error: 'Invalid practice type' },
      };
    }
  } catch (error) {
    logger.error(`[contollers/practice/postPractice] error = ${error}`);
    result = {
      responseStatus: 500,
      response: { error: 'Server error' },
    };
  }

  return res.status(result.responseStatus).json(result.response);
}

/**
 * @description Update card status
 * @param {number} userId
 * @param {number} cardId
 * @param {string} cardStatus
 * @returns {object|null} result
 */
async function gradeCard(userId, cardId, cardStatus) {
  let result;

  try {
    const card = new Card();
    const practice = new Practice();
    const user = new User(userId);

    // check that card owned by user
    const foundCard = await card.get(cardId);
    if (foundCard === null || foundCard.userId !== userId) throw new Error('Card not found');

    // change card status
    const ifUpdated = await card.update(cardId, undefined, undefined, cardStatus, undefined);
    if (!ifUpdated) throw new Error('Failed to update card');

    // get user timezone
    const userData = await user.get();
    if (userData === null || userData.attributes?.timezone === undefined) throw new Error('User not found');

    // make a record in the practice history
    const date = getDay(userData.attributes?.timezone);
    const newPractice = await practice.create(userId, cardId, cardStatus, date);
    if (!newPractice) throw new Error('Failed to create practice record');

    result = newPractice;
  } catch (error) {
    logger.error(
      '[contollers/practice/gradeCard] ' +
      `userId = ${userId}, cardId = ${cardId}, cardStatus = ${cardStatus}, error = ${error}`,
    );
    result = null;
  }

  return result;
}

export {
  getPractice,
  postPractice,
};
