import WSAvcPlayer from 'ws-avc-player';
import PCMPlayer from './pcm-player';
import createVisualiser from './visualiser';

const HOST = process.env.HOST || window.location.hostname;
const PORT = process.env.PORT || window.location.port;

const $appContainer = document.querySelector('#app-container');

// Create h264 player
var uri = `ws://${HOST}:${PORT}/video-stream`;
var wsavc = new WSAvcPlayer();
wsavc.connect(uri);
//expose instance for debugging
window.wsavc = wsavc;

const canvas = wsavc.AvcPlayer.canvas;
$appContainer.appendChild(canvas);



const player = new PCMPlayer({
  encoding: '16bitInt',
  channels: 1,
  sampleRate: 44100,
  flushingTime: 0
});
window.player = player;
//expose instance for debugging

const $audioLevel = document.querySelector('#audio-level');
const $visualisationCanvas = createVisualiser({
  stream: player.gainNode,
  audioContext: player.audioCtx,
  canvas: $audioLevel,
});

// $appContainer.appendChild($visualisationCanvas);


const audioStreamUrl = `ws://${HOST}:${PORT}/audio-stream`;

var ws = new WebSocket(audioStreamUrl);
ws.binaryType = 'arraybuffer';
ws.addEventListener('message',function(event) {
  const data = new Uint8Array(event.data);
  player.feed(data);
});



