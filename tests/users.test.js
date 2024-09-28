const createUserHandler = require('../createUsers/handler');
const deleteUserHandler = require('../deleteUser/handler');
const getUserHandler = require('../getUsers/handler');
const updateUserHandler = require('../updateUser/handler');
const AWS = require('aws-sdk');

// Mock DynamoDB DocumentClient
jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    put: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient)
    }
  };
});

describe('getUsers', () => {
  it('should return 500 when DynamoDB fails.', async () => {
    // Suprimir logs de errores en la consola para esta prueba
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const event = {
      pathParameters: {
        id: '12345'
      }
    };

    // Mock the DynamoDB get method to reject with an error
    AWS.DynamoDB.DocumentClient()
      .get()
      .promise.mockRejectedValue(new Error('DynamoDB failed'));

    const result = await getUserHandler.getUsers(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe('Could not retrieve user');

    // Restaurar el comportamiento original de console.error al finalizar la prueba
    consoleErrorSpy.mockRestore();
  });
});

describe('deleteUser', () => {
  it('should return 200 when user is deleted successfully.', async () => {
    const event = {
      pathParameters: {
        id: '12345'
      }
    };

    // Mock the DynamoDB delete method to resolve successfully
    AWS.DynamoDB.DocumentClient().promise.mockResolvedValue({});

    const result = await deleteUserHandler.deleteUser(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('User deleted successfully');
  });

  it('should return 500 when DynamoDB fails.', async () => {
    const event = {
      pathParameters: {
        id: '12345'
      }
    };

    // Mock the DynamoDB delete method to reject with an error
    AWS.DynamoDB.DocumentClient().promise.mockRejectedValue(
      new Error('DynamoDB failed')
    );

    const result = await deleteUserHandler.deleteUser(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe('Could not delete user');
  });

  it('should return 400 when no ID is provided in path parameters.', async () => {
    const event = {
      pathParameters: {}
    };

    const result = await deleteUserHandler.deleteUser(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe('User ID is required');
  });
});

describe('getUsers', () => {
  it('should return 200 and user data when the user is found.', async () => {
    const event = {
      pathParameters: {
        id: '12345'
      }
    };

    const mockUser = {
      id: '12345',
      name: 'John Doe',
      email: 'john.doe@example.com'
    };

    // Mock the DynamoDB get method to resolve with a user item
    AWS.DynamoDB.DocumentClient().promise.mockResolvedValue({
      Item: mockUser
    });

    const result = await getUserHandler.getUsers(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockUser);
  });

  it('should return 404 when the user is not found.', async () => {
    const event = {
      pathParameters: {
        id: '12345'
      }
    };

    // Mock the DynamoDB get method to return no item
    AWS.DynamoDB.DocumentClient().promise.mockResolvedValue({});

    const result = await getUserHandler.getUsers(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).error).toBe('User not found');
  });

  it('should return 400 when no ID is provided in path parameters.', async () => {
    const event = {
      pathParameters: {}
    };

    const result = await getUserHandler.getUsers(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe('User ID is required');
  });

  it('should return 500 when DynamoDB fails.', async () => {
    const event = {
      pathParameters: {
        id: '12345'
      }
    };

    // Mock the DynamoDB get method to reject with an error
    AWS.DynamoDB.DocumentClient().promise.mockRejectedValue(
      new Error('DynamoDB failed')
    );

    const result = await getUserHandler.getUsers(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe('Could not retrieve user');
  });
});

describe('updateUser', () => {
  it('should return 200 and updated user data when the user is updated successfully.', async () => {
    const event = {
      pathParameters: {
        id: '12345'
      },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane.doe@example.com'
      })
    };

    const updatedUser = {
      id: '12345',
      name: 'Jane Doe',
      email: 'jane.doe@example.com'
    };

    // Mock the DynamoDB update method to resolve with updated attributes
    AWS.DynamoDB.DocumentClient().promise.mockResolvedValue({
      Attributes: updatedUser
    });

    const result = await updateUserHandler.updateUser(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(updatedUser);
  });

  it('should return 500 when DynamoDB fails.', async () => {
    const event = {
      pathParameters: {
        id: '12345'
      },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane.doe@example.com'
      })
    };

    // Mock the DynamoDB update method to reject with an error
    AWS.DynamoDB.DocumentClient().promise.mockRejectedValue(
      new Error('DynamoDB failed')
    );

    const result = await updateUserHandler.updateUser(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe('Could not update user');
  });

  it('should return 400 when no body is provided in the request.', async () => {
    const event = {
      pathParameters: {
        id: '12345'
      },
      body: null
    };

    const result = await updateUserHandler.updateUser(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe('Request body is required');
  });

  it('should return 400 when no name or email is provided in the body.', async () => {
    const event = {
      pathParameters: {
        id: '12345'
      },
      body: JSON.stringify({
        name: '',
        email: ''
      })
    };

    const result = await updateUserHandler.updateUser(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe('Name and email are required');
  });
});
