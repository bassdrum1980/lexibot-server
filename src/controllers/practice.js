import { getLogger } from '../utils/logger.js';
import User from '../models/user.js';
import Card from '../models/card.js';
import { getDay } from '../utils/funDay.js';

const logger = getLogger();

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

export {
  getPractice,
};
