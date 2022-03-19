const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

//Inicializacion
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares

// sockets
require('./sockets')(io);

//Static files
app.use(express.static(path.join(__dirname, 'public')));

// starting server
server.listen(app.get('port'), () => {
    console.log("Server in port 3000");
});