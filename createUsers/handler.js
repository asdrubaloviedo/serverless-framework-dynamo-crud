const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const crypto = require('crypto');

// Función para formatear la respuesta HTTP
const formatResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body)
});

const createUser = async (event) => {
  if (!event.body) {
    return formatResponse(400, { error: 'Request body is required' });
  }

  const { name, email } = JSON.parse(event.body);

  if (!name || !email) {
    return formatResponse(400, { error: 'Name and email are required' });
  }

  const id = crypto.randomBytes(20).toString('hex');

  const params = {
    TableName: process.env.USERS_TABLE,
    Item: {
      id,
      name,
      email,
      createdAt: new Date().toISOString()
    }
  };

  try {
    await dynamoDb.put(params).promise();
    return formatResponse(201, params.Item);
  } catch (error) {
    return formatResponse(500, {
      error: 'Could not create user',
      details: error.message
    });
  }
};

module.exports = {
  createUser
};
