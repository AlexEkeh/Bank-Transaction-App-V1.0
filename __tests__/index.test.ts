import request from "supertest";
import app from '../src/app';


// TEST FOR GET ALL ACCOUNT INFORMATION
describe('GET /balance', () => {
  test('Should Return Status 200 For Empty Account Database for getAllBalance', async () => {
    const result = await request(app).get('/balance')
    .set('Accept', 'application/json');
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual([]);
  });
});


// TEST FOR GET SINGLE ACCOUNT INFORMATION
describe('GET /balance/accountNo', () => {
  test('Should Return Status 404 For Wrong Account Input OR No Input Specified For getSingleBalance', async () => {
    const result = await request(app).get('/balance/:accountNo')
    .set('Accept', 'application/json');
     expect(result.statusCode).toBe(404);
  })
});


// TEST FOR CREATE ACCOUNT
describe('POST /create-account', () => {
  test('Should Create a New Account And Return Status 201', async () => {
    const result = await request(app)
    .post('/create-account')
    .set('Accept', 'application/json')
    .send({
      "amount": 50000
    })
    expect(result.statusCode).toBe(201);
    expect(result.body.accountNo).toBeDefined()
    expect(result.body.balance).toBeDefined()
    expect(result.body.createdAt).toBeDefined()
  })
});


// TEST FOR FUNDS TRANSFER

describe('POST /transfer', () => {
  test('Should Return Status 400 If No Transaction Details Are Specified or Wrong Input', async () => {
    const result = await request(app)
    .post('/transfer')
    .set('Accept', 'application/json')
    expect(result.statusCode).toBe(400)
    expect(result.body.message).toBeDefined()
  })
});
