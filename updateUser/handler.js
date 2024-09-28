const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Función para formatear la respuesta HTTP
const formatResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body)
});

const updateUser = async (event) => {
  if (!event.body) {
    return formatResponse(400, { error: 'Request body is required' });
  }

  const { name, email } = JSON.parse(event.body);

  if (!name || !email) {
    return formatResponse(400, { error: 'Name and email are required' });
  }

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
      ':name': name,
      ':email': email
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return formatResponse(200, result.Attributes);
  } catch (error) {
    return formatResponse(500, {
      error: 'Could not update user',
      details: error.message
    });
  }
};

module.exports = {
  updateUser
};
