const request = require('supertest');
const axios = require('axios');
const app = require('../src/app');

// Mock axios so no real network requests are sent
jest.mock('axios');

describe('/sales/insights (integration tests)', () => {
  beforeAll(() => {
    process.env.OPENAI_API_KEY = 'test-key';
  });

  // Reset mocks before each test so they don't conflict
  beforeEach(() => {
    axios.post.mockReset();
  });

  afterAll(() => {
    delete process.env.OPENAI_API_KEY;
  });

  test('returns 400 for empty sales array', async () => {
    const response = await request(app)
      .post('/sales/insights')
      .send({ sales: [] });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid or empty sales array.' });
  });

  test('returns 400 if missing category or amount', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        choices: [
          {
            message: { content: 'Mocked AI summary.' }
          }
        ]
      }
    });

    const response = await request(app)
      .post('/sales/insights')
      .send({
        sales: [
          { category: 'Widgets', amount: 50 },
          { category: 'Gadgets' } // missing "amount"
        ]
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/missing 'category' or 'amount'/i);
  });

  test('returns 400 if amount is negative', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        choices: [
          {
            message: { content: 'Mocked AI summary.' }
          }
        ]
      }
    });

    const response = await request(app)
      .post('/sales/insights')
      .send({
        sales: [{ category: 'Widgets', amount: -5 }]
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/'amount' must be a non-negative number/i);
  });

  test('returns correct analytics (12757.25 total, 127.5725 avg, best=Widgets)', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        choices: [
          {
            message: { content: 'Mocked AI summary.' }
          }
        ]
      }
    });

    //    - 72 x Widgets => total 9202.75
    //    - 15 x Gadgets => total 1952.25
    //    - 13 x Tools   => total 1602.25
    const salesData = [
      // 72 Widgets
      ...Array(72).fill(null).map(() => ({
        category: 'Widgets',
        amount: 9202.75 / 72
      })),
      // 15 Gadgets
      ...Array(15).fill(null).map(() => ({
        category: 'Gadgets',
        amount: 1952.25 / 15
      })),
      // 13 Tools
      ...Array(13).fill(null).map(() => ({
        category: 'Tools',
        amount: 1602.25 / 13
      }))
    ];

    const response = await request(app)
      .post('/sales/insights')
      .send({ sales: salesData });
    expect(response.status).toBe(200);

    const { analytics, summary } = response.body;

    expect(analytics.totalSales).toBeCloseTo(12757.25, 2);
    expect(analytics.averageSales).toBeCloseTo(127.5725, 4);
    expect(analytics.bestCategory).toBe('Widgets');

    expect(analytics.salesPerCategory.Widgets).toBeCloseTo(9202.75, 2);
    expect(analytics.salesPerCategory.Gadgets).toBeCloseTo(1952.25, 2);
    expect(analytics.salesPerCategory.Tools).toBeCloseTo(1602.25, 2);

    expect(summary).toBe('Mocked AI summary.');
  });
});
