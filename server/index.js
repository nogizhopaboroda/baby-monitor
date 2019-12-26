const dotenv = require('dotenv');

dotenv.config();

const { PORT } = process.env;

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.log(err.stack);
});

const express = require('express');
const raspividStream = require('raspivid-stream');

const app = express();
const wss = require('express-ws')(app);

const mic = require('mic');

const micInstance = mic({
    rate: '16000',
    channels: '1',
    fileType: 'wav',
    debug: false,
    exitOnSilence: 6
});

const micInputStream = micInstance.getAudioStream();
micInstance.start();

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
  micInputStream.pipe(res);
});

app.ws('/audio-stream', (ws, req) => {
  console.log('Audio Client connected');

  micInputStream.on('data', function(data) {
    ws.send(data, {binary: true}, error => {
      if (error) console.error(error);
    });
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
