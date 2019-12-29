import WSAvcPlayer from 'ws-avc-player';
import PCMPlayer from './pcm-player';

const HOST = process.env.HOST || window.location.hostname;
const PORT = process.env.PORT || window.location.port;

// Create h264 player
var uri = `ws://${HOST}:${PORT}/video-stream`;
var wsavc = new WSAvcPlayer();
wsavc.connect(uri);
//expose instance for button callbacks
window.wsavc = wsavc;

const canvas = document.body.appendChild(wsavc.AvcPlayer.canvas);
document.body.appendChild(canvas);



const player = new PCMPlayer({
  encoding: '16bitInt',
  channels: 1,
  sampleRate: 44100,
  flushingTime: 0
});

const audioStreamUrl = `ws://${HOST}:${PORT}/audio-stream`;

const button = document.createElement('button');
button.innerHTML = 'play';
document.body.appendChild(button);
button.addEventListener('click', () => {
  var ws = new WebSocket(audioStreamUrl);
  ws.binaryType = 'arraybuffer';
  ws.addEventListener('message',function(event) {
    const data = new Uint8Array(event.data);
    player.feed(data);
  });
});



