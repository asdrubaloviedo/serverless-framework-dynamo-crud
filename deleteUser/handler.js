const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
  deleteUser
};
