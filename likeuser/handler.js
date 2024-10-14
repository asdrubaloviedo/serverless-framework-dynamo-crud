// A esta lambda worker llegara una cola con los like de los usuarios
const likeuser = (event, context) => {
  console.log('Estoy consumiendo los elementos de la cola de uno a la vez');
};

module.exports = {
  likeuser
};
