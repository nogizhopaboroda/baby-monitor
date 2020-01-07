#!/usr/bin/env node

const PORT = 9898;

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: PORT });

const stdin = process.stdin;
const stdout = process.stdout;

stdin.resume();
stdin.setEncoding('utf8');

stdin.pipe(stdout);

stdin.on('data', function (chunk) {
  // console.log(chunk);
});

stdin.on('end', function () {
  console.log('the end');
});


wss.on('connection', function connection(ws) {

  const sendData = (data) => {
    console.log('sending data');
    ws.send(data, { binary: true });
  }
  stdin.on('data', sendData);

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.on('close', () => {
    console.log('Client left');
    stdin.off('data', sendData);
  });

});
