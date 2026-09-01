const assert = require('node:assert');
const test = require('node:test');
const request = require('supertest');
const app = require('../src/app');

test('GET / returns API health message', async () => {
  const response = await request(app).get('/').expect(200);

  assert.strictEqual(response.body.success, true);
  assert.strictEqual(response.body.message, 'DevOps Todo API is running');
});

test('GET /missing returns 404 JSON response', async () => {
  const response = await request(app).get('/missing').expect(404);

  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.message, 'Route not found');
});
