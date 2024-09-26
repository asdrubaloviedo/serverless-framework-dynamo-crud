const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();

const formatResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body)
}); // Construimos una Respuesta previamente estructurada para no repetir codigo.

const getUsers = async (event) => {
  // Obtenemos el id de los paramatros de la URL
  const { id } = event.pathParameters;

  // Validar la existencia del ID antes de realizar la consulta
  if (!id) {
    return formatResponse(400, { error: 'User ID is required' });
  }

  const params = {
    TableName: process.env.USERS_TABLE,
    Key: { id }
  };

  try {
    const result = await dynamoDb.get(params).promise();

    // Si obtenemos un registro del get lo devolvemos y si no retornamos un error
    return result.Item
      ? formatResponse(200, result.Item)
      : formatResponse(404, { error: 'User not found' });
  } catch (error) {
    console.error('Error fetching user:', error);
    return formatResponse(500, {
      error: 'Could not retrieve user',
      details: error.message
    });
  }
};

module.exports = {
  getUsers
};
