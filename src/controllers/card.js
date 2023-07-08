import prisma from '../db.js';
import getLogger from '../utils/logger.js';
import User from '../models/user.js';
import Card from '../models/card.js';
import { getDay } from '../utils/funDay.js';

const logger = getLogger();

async function createCard(req, res) {
  let responseStatus;
  let result;

  const userId = req.user.id;
  const { word, attributes } = req.body;
  logger.debug('[contollers/card/postCard] ' +
    `userId = ${userId}, word = ${word}, attributes = ${JSON.stringify(attributes)}`);

  const card = new Card();
  const createdCard = await card.create(userId, word, attributes);
  if (createdCard) {
    responseStatus = 200;
    result = { data: createdCard };
  } else {
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

async function getCard(req, res) {
  let responseStatus;
  let result;

  const cardId = Number(req.params.id);
  logger.debug(`[contollers/card/getCard] cardId = ${cardId}`);

  const card = new Card();
  const foundCard = await card.get(cardId);
  if (foundCard) {
    responseStatus = 200;
    result = { data: foundCard };
  } else if (foundCard === undefined) {
    responseStatus = 404;
    result = { error: 'Card not found' };
  } else {
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

async function updateCard(req, res) {
  let responseStatus;
  let result;

  const cardId = Number(req.params.id);
  logger.debug(`[contollers/card/updateCard] cardId = ${cardId}`);
  const { word, attributes, status } = req.body;
  logger.debug(`[contollers/card/postCard] req.body = ${JSON.stringify(req.body)}`);

  const card = new Card();
  const updatedCard = await card.update(cardId, word, attributes, status);
  if (updatedCard) {
    responseStatus = 200;
    result = { data: updatedCard };
  } else {
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

async function deleteCard(req, res) {
  let responseStatus;
  let result;
  const cardId = Number(req.params.id);
  logger.debug(`[contollers/card/deleteCard] cardId = ${cardId}`);

  const card = new Card();
  const deletedCard = await card.delete(cardId);
  if (deletedCard) {
    responseStatus = 200;
    result = { data: deletedCard };
  } else {
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

async function getCards(req, res) {
  let responseStatus;
  let result;

  const userId = req.user.id;
  logger.debug(`[contollers/card/getCards] userId = ${userId}`);

  const user = new User(userId);
  const userData = await user.get();
  if (userData === null) {
    responseStatus = 500;
    result = { error: 'Server error' };
    return res.status(responseStatus).json(result);
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
      result = { error: 'Server error' };
      return res.status(responseStatus).json(result);
    }
  }

  // определим сколько карточек new + inactive планируется к показу
  const countCard = (firstTrain) ?
    userData.attributes.newCardCount :
    userData.attributes.newCardCount - userData.attributes.newCardToday;

  const foundCards = await card.createQueue(userId, countCard, currentDay);
  if (foundCards) {
    responseStatus = 200;
    result = { data: foundCards };
  } else {
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

export {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  getCards,
};
