/*
 Esta lambda se encargara de darnos una url firmada la cual luego usaremos para 
 subir objetos directamente a nuestro bucked sin necesidad de tener que volver a 
 pasar por la lambda(por un tiempo de 5 min)

 Primer paso(obtener url firmada):
    Method: Get
    Url: https://vlcluu2s3c.execute-api.us-east-1.amazonaws.com/dev/signedurl
    Params -> QueryParams
        KEY       VALUE
        filename  imagen-ejemplo.png

 Segundo paso:
    Method: Put
    Url: Usamos la url obtenida en el paso anterior
    Body -> Binary -> Selec file(Seleccionamos el png)
*/

const aws = require('aws-sdk');
const s3 = new aws.S3({ signatureVersion: 'v4' });

const formatResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body)
}); // Construimos una Respuesta previamente estructurada para no repetir codigo.

const signedS3Url = async (event, context) => {
  const filename = event.queryStringParameters.filename;
  const signedUrl = await s3.getSignedUrlPromise('putObject', {
    Key: `upload/${filename}`,
    Bucked: process.env.BUCKED,
    Expires: 300
  });

  return formatResponse(200, { signedUrl });
};

module.exports = {
  signedS3Url
};
