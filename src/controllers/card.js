import prisma from '../db.js';

async function postCard(req, res) {
  let status;
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
    status = 200;
    result = { data: createdCard };
  } catch (error) {
    console.error(
      '[contollers/card/postCard]' +
      'card creation error: ' +
      `userId = ${userId}, word = ${word}, attributes = ${JSON.stringify(attributes)}, error = ${error}`);
    status = 500;
    result = { error: 'server error' };
  }

  return res.status(status).json(result);
}

async function getCard(req, res) {
  let status;
  let result;
  const id = Number(req.params.id);
  console.log(`[contollers/card/getCard] id = ${id}`);

  const where = { id };

  try {
    const foundCard = await prisma.card.findUnique({ where });
    status = 200;
    result = { data: foundCard };
  } catch (error) {
    console.error(
      '[contollers/card/getCard]' +
      `card find error: id = ${id}, error = ${error}`);
    status = 500;
    result = { error: 'server error' };
  }

  return res.status(status).json(result);
}

export {
  postCard,
  getCard,
};
