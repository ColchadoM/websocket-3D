'use strict';

/*****************
 * ThreeJS logic *
 *****************/

var scene, camera, renderer;
var canvas;

function setup3D () {
  scene = new THREE.Scene();

  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.z = 10;

  canvas = document.getElementsByTagName('canvas')[0];
  renderer = new THREE.WebGLRenderer({
    canvas    : canvas,
    antialias : true,
    alpha     : true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  $(window).on('resize', onWindowResize);

  // Begin animate
  animate();
}

function onWindowResize () {
  var aspectRatio = window.innerWidth / window.innerHeight;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate () {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

/*******************
 * WebSocket logic *
 *******************/

// WebSocket
var wsURL = 'ws://localhost:1881';
var connection;

function setupWebSocket () {
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  connection = new WebSocket (wsURL);

  connection.onopen    = onConnectionOpen;
  connection.onerror   = onConnectionError;
  connection.onmessage = onConnectionMessage;
}

function onConnectionOpen () {
  console.log('Connected with server!');

  var message = {
    type : 'register',
    data : 'output'
  };
  connection.send(JSON.stringify(message));
}

function onConnectionError () {
  console.log('Error in connection :(!');
}

function onConnectionMessage (event) {
  var payload = event.data;
  var message = JSON.parse(payload);
  console.log(message);
}

$(document).ready(function () {
  var mDetect = new MobileDetect(window.navigator.userAgent);
  if (mDetect.mobile()) {
    window.location.pathname = '/mobile.html';
    return;
  }

  setup3D();
  setupWebSocket();
});
