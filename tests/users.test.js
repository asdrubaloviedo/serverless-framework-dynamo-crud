const handler = require('../createUsers/handler');
const AWS = require('aws-sdk');

// Mock DynamoDB DocumentClient
jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    put: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient)
    }
  };
});

describe('createUser', () => {
  it('should return 201 when user is created.', async () => {
    const event = {
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com'
      })
    };

    // Mock the DynamoDB put method to resolve successfully
    AWS.DynamoDB.DocumentClient().promise.mockResolvedValue({});

    const result = await handler.createUser(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toHaveProperty('id');
    expect(JSON.parse(result.body).name).toBe('John Doe');
    expect(JSON.parse(result.body).email).toBe('john.doe@example.com');
  });

  it('should return 500 when DynamoDB fails.', async () => {
    const event = {
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com'
      })
    };

    // Mock the DynamoDB put method to reject with an error
    AWS.DynamoDB.DocumentClient().promise.mockRejectedValue(
      new Error('DynamoDB failed')
    );

    const result = await handler.createUser(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe('Could not create user');
  });
});
