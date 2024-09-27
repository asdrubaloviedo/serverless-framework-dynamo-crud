const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const crypto = require('crypto');

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
      body: JSON.stringify({
        error: 'Could not create user',
        details: error.message
      })
    };
  }
};

module.exports = {
  createUser
};
