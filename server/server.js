'use strict';

// Globals
var WebSocket = require('ws');
var WS_PORT = 1881;

var inputClients = [];
var outputClient;

var id = 0;

/*****************************
 * WebSocketServer Callbacks *
 *****************************/

function onListening () {
  console.log((new Date()) + ' Server is listening on port ' + WS_PORT);
}

function onConnection (connection, request) {
  var ip = request.connection.remoteAddress;
  console.log((new Date()) + ' Connection from ' + ip + '.');
  console.log(connection);

  connection.on('message', function (message) { onMessage(connection, message); });
  connection.on('close', function () { onClose(connection); });
}

function onMessage (connection, messageStr) {
  console.log((new Date()) + ' Received Message: ' + messageStr);

  var message = JSON.parse(messageStr);

  if (message.type === 'register') {
    onRegisterMessage(connection, message);
  }

  else if (message.type === 'angle') {
    onAngleMessage(connection, message);
  }
}

function onRegisterMessage (connection, message) {
  if (message.data === 'input') {
    inputClients.push(connection);
    connection.id = id;
    id++;

  } else {
    outputClient = connection;
  }
}

function onAngleMessage () {
}

function onClose (connection) {
  console.log((new Date()) + ' Peer disconnected.');
}

/***************
 * Main script *
 ***************/

var wsServer = new WebSocket.Server({
  port: WS_PORT
});

wsServer.on('listening', onListening);
wsServer.on('connection', onConnection);
