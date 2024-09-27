// tests/users.test.js
const AWS = require('aws-sdk');
const handler = require('../createUsers/handler');

// Simular DynamoDB
const putMock = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({})
});

AWS.DynamoDB.DocumentClient = jest.fn(() => ({
  put: putMock
}));

test('createUser should return 201 when user is created', async () => {
  const event = {
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john.doe@example.com'
    })
  };

  const result = await handler.createUser(event);

  expect(result.statusCode).toBe(201);
  expect(JSON.parse(result.body).name).toBe('John Doe');
});
