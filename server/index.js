const dotenv = require('dotenv');

dotenv.config();

const {PORT} = process.env;

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.log(err.stack);
});

const express = require('express');
const raspividStream = require('raspivid-stream');

const app = express();
const wss = require('express-ws')(app);
const websocketStream = require('websocket-stream/stream');

const createMicrophoneStream = require('../lib/microphone');

const micInputStream = createMicrophoneStream();

app.get('/', (req, res) => res.sendFile(process.cwd() + '/dist/index.html'));
app.use(express.static('dist'));

app.ws('/video-stream', (ws, req) => {
  console.log('Client connected');

  var videoStream = raspividStream();

  videoStream.on('data', data => {
    ws.send(data, {binary: true}, error => {
      if (error) console.error(error);
    });
  });

  ws.on('close', () => {
    console.log('Client left');
    videoStream.removeAllListeners('data');
  });
});

app.get('/audio', (req, res) => {
  res.writeHead(200, {'Content-Type': 'audio/wav'});
  console.log('Client connected')
  const writeChunk = (data) => {
    res.write(data);
  };
  micInputStream.stdout.on('data', writeChunk);
  res.on('close',function(){
    console.log('Client left')
    micInputStream.stdout.off('data', writeChunk);
  })
});

app.ws('/audio-stream', (ws, req) => {
  console.log('Audio Client connected');
  const stream = websocketStream(ws, {
    // websocket-stream options here
    binary: false,
  });
  micInputStream.stdout.on('data', (data) => {
    console.log('sending mic data to socket');
    ws.send(data);
  });

  // ws.on('close', () => {
  // console.log('Audio Client left');
  // stop piping
  // });
});

app.use(function(err, req, res, next) {
  console.error(err);
  next(err);
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
