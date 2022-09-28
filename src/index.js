const express = require('express');
const path = require('path');
const app = express();
//Esto de abajo es para utilizar socket io sobre un servidor hecho con el modulo http de node aunque utilizando express.Entonces luego reemplazo app.listen por server.listen.
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.set('port', PORT);

require('./sockets')(io);

//Archivos estaticos
//Esto del path.join con __dirname une el dirname que te da toda la direccion de donde esta el archivo de y le sumo public que es como /public y todo lo enterior lo pone el path.join
app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'), () => {
  console.log('Servidor en el puerto', app.get('port'));
});
