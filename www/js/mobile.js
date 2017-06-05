'use strict';

var content;

/**********************
 * Device orientation *
 **********************/

function onDeviceOrientation (event) {
  if (connection && connection.readyState === connection.OPEN) {
    var message = {
      type : 'angle',
      data : event.gamma
    };
    connection.send(JSON.stringify(message));
  }

  if (!event.gamma) {
    content.html('undefined');
  }
  else {
    content.html(event.gamma);
  }
}

/*******************
 * WebSocket logic *
 *******************/

// WebSocket
var wsURL = 'ws://192.168.43.36:1881';
var connection;

function setupWebSocket () {
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  connection = new WebSocket (wsURL);

  connection.onopen  = onConnectionOpen;
  connection.onerror = onConnectionError;
}

function onConnectionOpen () {
  console.log('Connected with server!');

  var message = {
    type : 'register',
    data : 'input'
  };
  connection.send(JSON.stringify(message));
}

function onConnectionError () {
  console.log('Error in connection :(!');
}

$(document).ready(function () {
  content = $('#content');

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', onDeviceOrientation);
    
    setupWebSocket();
  }
  else {
    content.html('Sorry, your browser doesnt support Device Orientation');
  }
});
