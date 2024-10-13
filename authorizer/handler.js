// Sistema de authenticacion personalizada(Custom)
const authorize = async (event, context) => {
  let date = new Date();
  let minutes = date.getMinutes();
  let hour = date.getHours();
  // A todas las solicitudes que tengan el token SECRET_EGG y que no haya pasado mas de 1 minuto
  if (
    event.authorizationToken ===
    `Bearer ${process.env.SECRET_EGG}-${hour}-${minutes}`
  ) {
    //Les permitimos usar las apis
    return {
      principalId: 'anonymous',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn
          }
        ]
      }
    };
  }
  throw Error('Unauthorized');
};

module.exports = {
  authorize
};
