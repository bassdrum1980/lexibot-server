import request from 'supertest';
import app from '../src/index.js';
import 'dotenv/config.js';
import assert from 'assert';
import Card from '../src/models/card.js';

const token = process.env.TEST_USER_BEARER_TOKEN;
const userId = Number(process.env.TEST_USER_ID);
const card = new Card();

describe('GET /practices/:practiceType', () => {
  let cardIds = [];

  before(async () => {
    // cоздадим карточки, которые должны попасть в тренировку
    let cardCreated = await card.create(userId, 'test1', { translate: 'test1' });
    cardIds[0] = cardCreated.id;
    cardCreated = await card.create(userId, 'test2', { translate: 'test2' });
    await card.update(cardCreated.id, undefined, undefined, 'new', undefined);
    cardIds[1] = cardCreated.id;
    cardCreated = await card.create(userId, 'test3', { translate: 'test3' });
    await card.update(cardCreated.id, undefined, undefined, 'review', 220101);
    cardIds[2] = cardCreated.id;
    // cоздадим карточки, которые не должны попасть в тренировку
    cardCreated = await card.create(userId, 'test4', { translate: 'test4' });
    await card.update(cardCreated.id, undefined, undefined, 'review', 990101);
    cardIds[3] = cardCreated.id;
  });

  after(async () => {
    for (const cardId of cardIds) {
      if (cardId) await card.delete(cardId);
    }
  });

  it('should return 200 and card data for daily practice', async () => {
    const response = await request(app)
      .get('/practices/daily')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.data.length, 3);
  });
});
