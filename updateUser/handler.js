const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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

module.exports = {
  updateUser
};
