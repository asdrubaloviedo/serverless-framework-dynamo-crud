// tests/users.test.js
const handler = require('../createUsers/handler');

test('createUser should return 201 when user is created', async () => {
  const event = {
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john.doe@example.com'
    })
  };

  const result = await handler.createUser(event);

  expect(result.statusCode).toBe(201);

  const body = JSON.parse(result.body);
  expect(body.name).toBe('John Doe');
  expect(body.email).toBe('john.doe@example.com');
  expect(body).toHaveProperty('id');
});
