const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const crypto = require('crypto');

// Crear usuario
const createUser = async (event) => {
  const pk = crypto.randomBytes(20).toString('hex');

  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.USERS_TABLE,
    Item: {
      id: pk,
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString()
    }
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(params.Item)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create user' })
    };
  }
};

// Obtener usuario
const getUser = async (event) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item)
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve user' })
    };
  }
};

// Actualizar usuario
const updateUser = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: event.pathParameters.id
    },
    UpdateExpression: 'SET #name = :name, email = :email',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':email': data.email
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update user' })
    };
  }
};

// Eliminar usuario
const deleteUser = async (event) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete user' })
    };
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser
};
