// Función para formatear la respuesta HTTP
const formatResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body)
});

/* Esta funcion deberia generar diferentes tamanos de thumbnails al crearse un thumbnail, sin embargo de momento
solo devolvemos una respuesta */
const thumbGenerator = async (event) => {
  try {
    return formatResponse(200, { message: 'Thumbnail created successfully' });
  } catch (error) {
    return formatResponse(500, {
      error: 'Could not create thumbnail',
      details: error.message
    });
  }
};

module.exports = {
  thumbGenerator
};
