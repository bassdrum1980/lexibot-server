import request from 'supertest';
import { app, server } from '../src/index.js';
import 'dotenv/config.js';
import Card from '../src/models/card.js';

const token = process.env.TEST_USER_BEARER_TOKEN;
const userId = Number(process.env.TEST_USER_ID);
const card = new Card();

afterAll(async () => {
  await server.close();
});

describe('GET /practices/:practiceType', () => {
  let cardIds = [];

  beforeAll(async () => {
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

  afterAll(async () => {
    for (const cardId of cardIds) {
      if (cardId) await card.delete(cardId);
    }
  });

  test('should return 200 and card data for daily practice', async () => {
    const response = await request(app)
      .get('/practices/daily')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);
  });
});

describe('POST /practices/:practiceType', () => {
  let cardId;
  const cardStatus = 'review';

  beforeAll(async () => {
    const cardCreated = await card.create(userId, 'test1', { translate: 'test1' });
    cardId = cardCreated.id;
  });

  afterAll(async () => {
    await card.delete(cardId);
  });

  test('should return 200 and card data for daily practice', async () => {
    const response = await request(app)
      .post('/practices/daily')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send({ cardId, cardStatus });
    expect(response.status).toBe(200);
    expect(response.body.data.cardId).toBe(cardId);
    expect(response.body.data.status).toBe(cardStatus);
  });
});
