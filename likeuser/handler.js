// A esta lambda worker llegara una cola con los like de los usuarios
const AWS = require('aws-sdk');

let DBClientParams = {};
const dynamoDB = new AWS.DynamoDB.DocumentClient(DBClientParams);
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Sumara de uno en uno todos los likes que vienen de la cola
const likeuser = async (event, context) => {
  console.log('Estoy consumiendo los elementos de la cola de uno a la vez');
  const body = event.Records[0].body;
  const userid = JSON.parse(body).id;
  const params = {
    TableName: 'usersTable',
    Key: { pk: userid },
    UpdateExpression: 'ADD likes :inc',
    ExpressionAttributeValues: {
      ':inc': 1
    },
    ReturnValues: 'ALL_NEW'
  };
  const result = await dynamoDB.update(params).promise();
  // Aproximadamente cada 4 segundosdeberia sumarse un like
  // Esto en verdad no es necesario, es solo con fines didacticos
  await sleep(4000);

  console.log('result: ', result);
};

module.exports = {
  likeuser
};
