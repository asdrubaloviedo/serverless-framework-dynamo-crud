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
  expect(JSON.parse(result.body).message).toBe('User created successfully');
});
