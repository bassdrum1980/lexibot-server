import request from 'supertest';
import { app, server } from '../src/index.js';
import 'dotenv/config.js';
import assert from 'assert';
import Card from '../src/models/card.js';
import { Transports } from '../src/utils/logger.js';

Transports.console.silent = true;
Transports.file.silent = true;

const token = process.env.TEST_USER_BEARER_TOKEN;
const userId = Number(process.env.TEST_USER_ID);
const card = new Card();

afterAll(async () => {
  await server.close();
});

describe('GET /cards/:id', () => {
  let cardId;

  beforeAll(async () => {
    const cardCreated = await card.create(userId, 'test', { translate: 'test' });
    cardId = cardCreated.id;
  });

  afterAll(async () => {
    if (cardId) await card.delete(cardId);
  });

  test('should return 200 and card data', async () => {
    const response = await request(app)
      .get(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.data.id, cardId);
  });

  it('should return 404', async () => {
    const response = await request(app)
      .get('/cards/0')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 404);
  });

  it('should return 500', async () => {
    const response = await request(app)
      .get('/cards/abc')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 500);
  });

});

describe('PATCH /cards/:id', () => {
  let cardId;

  beforeAll(async () => {
    const cardCreated = await card.create(userId, 'test', { translate: 'test' });
    cardId = cardCreated.id;
  });

  afterAll(async () => {
    if (cardId) await card.delete(cardId);
  });

  test('should return 200 and card data', async () => {
    const updatedCard = {
      word: 'updated',
      attributes: {
        word: 'updated',
      },
    };
    const response = await request(app)
      .patch(`/cards/${cardId}`)
      .send(updatedCard)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.data.id, cardId);
    assert.deepStrictEqual(response.body.data.word, updatedCard.word);
  });

  test('should return 500', async () => {
    const response = await request(app)
      .patch('/cards/abc')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 500);
  });
});

describe('DELETE /cards/:id', () => {
  let cardId;

  beforeAll(async () => {
    const cardCreated = await card.create(userId, 'test', { translate: 'test' });
    cardId = cardCreated.id;
  });

  test('should return 200', async () => {
    const response = await request(app)
      .delete(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 200);
  });

  test('should return 500', async () => {
    const response = await request(app)
      .delete('/cards/abc')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 500);
  });
});

describe('POST /cards', () => {
  let cardId;

  afterAll(async () => {
    if (cardId) await card.delete(cardId);
  });

  test('should return 200 and card data', async () => {
    const card = {
      word: 'test',
      attributes: {
        word: 'test',
      },
    };
    const response = await request(app)
      .post('/cards/')
      .send(card)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.data.word, card.word);
    assert.deepStrictEqual(response.body.data.attributes.word, card.attributes.word);
    cardId = response.body.data.id;
  });

  test('should return 422', async () => {
    const response = await request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 422);
  });

});
