import WSAvcPlayer from './ws-avc-player';
import PCMPlayer from './pcm-player';
import createVisualiser from './visualiser';

const HOST = process.env.HOST || window.location.hostname;
const PORT = process.env.PORT || window.location.port;

const $appContainer = document.querySelector('#app-container');

class StreamClient {
  constructor(options = {}){
    this.options = options;
    this.createSocket();
  }
  createSocket(){
    const { url } = this.options;
    const ws = this.ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';

    ws.onopen = this.onOpen.bind(this);
    ws.onmessage = this.onMessage.bind(this);
  }
  onOpen(){
    this.options.onOpen && this.options.onOpen();
  }
  onMessage(event){
    const data = new Uint8Array(event.data);
    this.options.onMessage && this.options.onMessage(data);
  }
}

const wsavc = new WSAvcPlayer();

const videoStream = new StreamClient({
  url: `ws://127.0.0.1:8001`,
  onOpen(){
    wsavc.framesList = []
    console.log('Connected to video stream');
  },
  onMessage(data){
    wsavc.feed(data);
  }
});

const canvas = wsavc.AvcPlayer.canvas;
$appContainer.appendChild(canvas);



const player = new PCMPlayer({
  encoding: '16bitInt',
  channels: 1,
  sampleRate: 44100,
  flushingTime: 0
});

const audioStream = new StreamClient({
  url: `ws://127.0.0.1:8000`,
  onOpen(){
    console.log('Connected to audio stream');
  },
  onMessage(data){
    player.feed(data);
  }
});


const $audioLevel = document.querySelector('#audio-level');
const $visualisationCanvas = createVisualiser({
  stream: player.gainNode,
  audioContext: player.audioCtx,
  canvas: $audioLevel,
});

