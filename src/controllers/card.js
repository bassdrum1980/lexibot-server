import prisma from '../db.js';
import getLogger from '../utils/logger.js';

const logger = getLogger();

async function createCard(req, res) {
  let responseStatus;
  let result;
  const userId = req.user.id;
  const { word, attributes } = req.body;
  logger.debug('[contollers/card/postCard] ' +
    `userId = ${userId}, word = ${word}, attributes = ${JSON.stringify(attributes)}`);

  const newCard = {
    userId,
    word,
    attributes,
  };

  try {
    const createdCard = await prisma.card.create({ data: newCard });
    responseStatus = 200;
    result = { data: createdCard };
  } catch (error) {
    logger.error('[contollers/card/postCard]' +
      `card creation error: req.body = ${JSON.stringify(req.body)}, error = ${error}`);
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

async function getCard(req, res) {
  let responseStatus;
  let result;
  const id = Number(req.params.id);
  logger.debug(`[contollers/card/getCard] id = ${id}`);

  const where = { id };
  const select = {
    id: true,
    word: true,
    status: true,
    attributes: true,
  };

  try {
    const foundCard = await prisma.card.findUnique({ where, select });
    if (!foundCard) {
      responseStatus = 404;
      result = { error: 'Card not found' };
    } else {
      responseStatus = 200;
      result = { data: foundCard };
    }
  } catch (error) {
    logger.error(
      '[contollers/card/getCard]' +
      `card find error: id = ${id}, error = ${error}`);
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

async function updateCard(req, res) {
  let responseStatus;
  let result;
  const id = Number(req.params.id);
  logger.debug(`[contollers/card/updateCard] id = ${id}`);
  const { word, attributes, status } = req.body;
  logger.debug(`[contollers/card/postCard] req.body = ${JSON.stringify(req.body)}`);

  const where = { id };
  const data = { word, attributes, status };

  try {
    const updatedCard = await prisma.card.update({ where, data });
    responseStatus = 200;
    result = { data: updatedCard };
  } catch (error) {
    logger.error(
      '[contollers/card/updateCard]' +
      'card update error: ' +
      `id = ${id}, req.body = ${JSON.stringify(req.body)}, error = ${error}`);
    responseStatus = 500;
    result = { error: 'Server error' };
  }

  return res.status(responseStatus).json(result);
}

async function deleteCard(req, res) {
  let responseStatus;
  let result;
  const id = Number(req.params.id);
  logger.debug(`[contollers/card/deleteCard] id = ${id}`);

  const where = { id };

  try {
    const deletedCard = await prisma.card.delete({ where });
    responseStatus = 200;
    result = { data: deletedCard };
  } catch (error) {
    logger.error(
      '[contollers/card/deleteCard]' +
      `card delete error: id = ${id}, error = ${error}`);
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
};
