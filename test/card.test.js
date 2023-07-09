import request from 'supertest';
import app from '../src/index.js';
import 'dotenv/config.js';
import assert from 'assert';
import Card from '../src/models/card.js';

const token = process.env.TEST_USER_BEARER_TOKEN;
const userId = Number(process.env.TEST_USER_ID);
const card = new Card();

describe('POST /cards', () => {
  let cardId;

  after(async () => {
    if (cardId) await card.delete(cardId);
  });

  it('should return 200 and card data', async () => {
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

  it('should return 422', async () => {
    const response = await request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 422);
  });

});

describe('GET /cards/:id', () => {
  let cardId;

  before(async () => {
    const cardCreated = await card.create(userId, 'test', { translate: 'test' });
    cardId = cardCreated.id;
  });

  after(async () => {
    if (cardId) await card.delete(cardId);
  });

  it('should return 200 and card data', async () => {
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

  before(async () => {
    const cardCreated = await card.create(userId, 'test', { translate: 'test' });
    cardId = cardCreated.id;
  });

  after(async () => {
    if (cardId) await card.delete(cardId);
  });

  it('should return 200 and card data', async () => {
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

  it('should return 500', async () => {
    const response = await request(app)
      .patch('/cards/abc')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 500);
  });
});

describe('DELETE /cards/:id', () => {
  let cardId;

  before(async () => {
    const cardCreated = await card.create(userId, 'test', { translate: 'test' });
    cardId = cardCreated.id;
  });

  it('should return 200', async () => {
    const response = await request(app)
      .delete(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 200);
  });

  it('should return 500', async () => {
    const response = await request(app)
      .delete('/cards/abc')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 500);
  });
});

describe('GET /cards', () => {
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

  it('should return 200 and card data', async () => {
    const response = await request(app)
      .get('/cards')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.data.length, 3);
  });
});
