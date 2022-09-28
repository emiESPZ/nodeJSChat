module.exports = (io) => {

  let nickNames=[];

  io.on('connection', socket => {
    console.log('Nuevo usuario conectado');

    //Al recibir un mensaje, recogemos los datos que vienen de main.js de socket.emit.
    socket.on('mensaje', (data)=>{
      console.log(data); //este log va a salir en la consola del navegador tambien
      //Y lo que tengo que hacer es que se visualicen en la ventana de chat para que los vea el usuario.

      //Enviar un mensaje al usuario (es decir que desde el lado del cliente (main.js) tambien se va a recibir el mensaje):

      io.sockets.emit('nuevo mensaje', {
        msg:data,
        username:socket.nickname
      });
    });

    //Se crea el usuario. Si el usuario existe en el array nickNames (es decir, que el index es distinto de -1 (-1 significa array vacio en indexOf)), devolvemos falso.
    //Caso contrario devolvemos true y el nickname pasa a ser la data que enviamos al array.
    socket.on('nuevo usuario', (data, callback)=>{

      if(nickNames.indexOf(data) != -1){
        callback(false);
      }else {
        callback(true);
        socket.nickname = data;
        nickNames.push(socket.nickname);

        io.sockets.emit('nombre usuario', nickNames);
      }
      
    });

    socket.on('disconnect', data => {

      if(!socket.nickname){
        return;
      }else{
        nickNames.splice(nickNames.indexOf(socket.nickname),1);
        io.sockets.emit('nombre usuario', nickNames);
      }

    });

  });
}