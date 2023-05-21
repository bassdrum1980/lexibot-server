import prisma from '../db.js';

async function postCard(req, res) {
  let responseStatus;
  let result;
  const { userId, word, attributes } = req.body;
  console.log(`[contollers/card/postCard] userId = ${userId}`);
  console.log(`[contollers/card/postCard] word = ${word}`);
  console.log(`[contollers/card/postCard] attributes = ${JSON.stringify(attributes)}`);

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
    console.error(
      '[contollers/card/postCard]' +
      `card creation error: req.body = ${JSON.stringify(req.body)}, error = ${error}`);
    responseStatus = 500;
    result = { error: 'server error' };
  }

  return res.status(responseStatus).json(result);
}

async function getCard(req, res) {
  let responseStatus;
  let result;
  const id = Number(req.params.id);
  console.log(`[contollers/card/getCard] id = ${id}`);

  const where = { id };

  try {
    const foundCard = await prisma.card.findUnique({ where });
    responseStatus = 200;
    result = { data: foundCard };
  } catch (error) {
    console.error(
      '[contollers/card/getCard]' +
      `card find error: id = ${id}, error = ${error}`);
    responseStatus = 500;
    result = { error: 'server error' };
  }

  return res.status(responseStatus).json(result);
}

async function updateCard(req, res) {
  let responseStatus;
  let result;
  const id = Number(req.params.id);
  console.log(`[contollers/card/updateCard] id = ${id}`);
  const { word, attributes, status } = req.body;
  console.log(`[contollers/card/updateCard] word = ${word}`);
  console.log(`[contollers/card/updateCard] attributes = ${JSON.stringify(attributes)}`);
  console.log(`[contollers/card/updateCard] status = ${status}`);

  const where = { id };
  const data = { word, attributes, status };

  try {
    const updatedCard = await prisma.card.update({ where, data });
    responseStatus = 200;
    result = { data: updatedCard };
  } catch (error) {
    console.error(
      '[contollers/card/updateCard]' +
      'card update error: ' +
      `id = ${id}, req.body = ${JSON.stringify(req.body)}, error = ${error}`);
    responseStatus = 500;
    result = { error: 'server error' };
  }

  return res.status(responseStatus).json(result);
}

async function deleteCard(req, res) {
  let responseStatus;
  let result;
  const id = Number(req.params.id);
  console.log(`[contollers/card/deleteCard] id = ${id}`);

  const where = { id };

  try {
    const deletedCard = await prisma.card.delete({ where });
    responseStatus = 200;
    result = { data: deletedCard };
  } catch (error) {
    console.error(
      '[contollers/card/deleteCard]' +
      `card delete error: id = ${id}, error = ${error}`);
    responseStatus = 500;
    result = { error: 'server error' };
  }

  return res.status(responseStatus).json(result);
}

export {
  postCard,
  getCard,
  updateCard,
  deleteCard,
};
