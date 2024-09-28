const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Función para formatear la respuesta HTTP
const formatResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body)
});

const deleteUser = async (event) => {
  if (!event.pathParameters.id) {
    return formatResponse(400, { error: 'User ID is required' });
  }

  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  try {
    await dynamoDb.delete(params).promise();
    return formatResponse(200, { message: 'User deleted successfully' });
  } catch (error) {
    return formatResponse(500, {
      error: 'Could not delete user',
      details: error.message
    });
  }
};

module.exports = {
  deleteUser
};
