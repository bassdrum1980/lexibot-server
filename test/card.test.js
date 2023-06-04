import request from 'supertest';
import app from '../src/index.js';
import 'dotenv/config.js';
import assert from 'assert';

const token = process.env.TEST_USER_BEARER_TOKEN;

describe('POST /cards', () => {
  let cardId;

  after(async () => {
    if (cardId) {
      await request(app)
        .delete(`/cards/${cardId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
    }
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

  it('should return 500', async () => {
    const response = await request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 500);
  });

});

describe('GET /cards/:id', () => {
  let cardId;

  before(async () => {
    const card = {
      word: 'test',
    };
    const response = await request(app)
      .post('/cards/')
      .send(card)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    cardId = response.body.data.id;
  });

  after(async () => {
    if (cardId) {
      await request(app)
        .delete(`/cards/${cardId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
    }
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

describe('PUT /cards/:id', () => {
  let cardId;

  before(async () => {
    const card = {
      word: 'test',
    };
    const response = await request(app)
      .post('/cards/')
      .send(card)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    cardId = response.body.data.id;
  });

  after(async () => {
    if (cardId) {
      await request(app)
        .delete(`/cards/${cardId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
    }
  });

  it('should return 200 and card data', async () => {
    const updatedCard = {
      word: 'updated',
    };
    const response = await request(app)
      .put(`/cards/${cardId}`)
      .send(updatedCard)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.data.id, cardId);
    assert.deepStrictEqual(response.body.data.word, updatedCard.word);
  });

  it('should return 500', async () => {
    const response = await request(app)
      .put('/cards/abc')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    assert.deepStrictEqual(response.status, 500);
  });
});

describe('DELETE /cards/:id', () => {
  let cardId;

  before(async () => {
    const card = {
      word: 'test',
    };
    const response = await request(app)
      .post('/cards/')
      .send(card)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    cardId = response.body.data.id;
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