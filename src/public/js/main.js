// Este archivo main.js es el lado del cliente 

$(function(){
  const socket = io();
  let nick = '';

  //Accedemos a los elementos del DOM conJQuery:

  const messagesForm = $('#messages-form');
  const messageBox = $('#message');
  const chat = $('#chat');

  const nickForm = $('#nick-form');
  const nickError = $('#nick-error');
  const nickName = $('#nick-name');

  const userNames = $('#usernames')

  //Eventos

  //Enviamos un mensaje al servidor. Agarra el evento SUBMIT(que se genera cuando se envia un FORM), prevent para evitar que se recargue la pagina.
  //SOCKET.EMIT ('Nombre del Mensaje', data que se envia al servidor, en este caso el valor de lo que se escriba en MESSAGEBOX).
  //El nombre del mensaje es solo para poder agarrarlo desde el lado del servidor con socket.on('Mensaje', function(data)). Data es lo que viene del value del messageBox.
  //El message que se envia, lo recibo desde el servidor (sockets.js).
  messagesForm.submit(e => {
    e.preventDefault();
    socket.emit('mensaje', messageBox.val());
    messageBox.val('');
  });

  //Obtenemos la respuesta del servidor:
  socket.on('nuevo mensaje', function (data){
    //console.log(data);

    let color = "#f4f4f4";

    if(nick == data.username){
      color = "#9ff4c5";
    }

    chat.append(`<div class ='msg-area mb-2 d-flex' style = 'background-color:${color}'><b>${data.username} :</b><p class='msg'>${data.msg}</p></div>`)
  }) //d-flex es una clase de bootstrap que te pone un elemento a continuacion del otro, en este caso para que el texto escrito aparezca al lado del nick en vez de abajo.

  //Nuevo usuario:
  //Agarra el formulario de nick que hice en el index.html, agarra el evento submit, preventdefault y luego el socket.emit para enviar el value del #nick-name al servidor.
  //Si viene la data (que seria la respuesta del cliente, (el callback)), la variable nick pasa a tener el value del #nick-name luego se esconde el nick form y aparece el chat.
  //En caso de que que el callback vuelva como (false) va al error, porque el usuario ya existe en el array.
  //Luego el value vuelve a cero con (' ')
  nickForm.submit(e=>{
    e.preventDefault();
    socket.emit('nuevo usuario', nickName.val(), data =>{
      if (data){
        nick = nickName.val();
        $('#nick-wrap').hide();
        $('#content-wrap').show();
      }else{
        nickError.html('<div class ="alert alert-danger">Ya existe un usuario con ese nombre</div>')
      }
      nickName.val('');
    })
  });

  //Obtenemos el array de usuarios conectados

  socket.on('nombre usuario', data =>{

    let html = '';
    let color = '';
    let salir = '';

    //Bucle para poder acceder al array de usuarios conectados

    for (let i = 0; i < data.length; i++){
      if(nick == data[i]){
        color = "#027f43";
        salir = '<a class ="enlace-salir" href="/">Salir</a>';
      } else{
        color ="#000";
        salir = '';
      }
      html += `<p style = "color: ${color}">${data[i]} ${salir}</p>`;
    }

    userNames.html(html);

  })

});

