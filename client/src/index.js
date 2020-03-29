// import WSAvcPlayer from './ws-avc-player';
import VideoPlayer from './video-player';
import AudioPlayer from './audio-player';
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

const videoPlayer = new VideoPlayer({
  onReady: () => {
    console.log('Video player is ready');
    const videoStream = new StreamClient({
      url: `ws://${HOST}:8001`,
      onOpen(){
        videoPlayer.framesList = []
        console.log('Connected to video stream');
      },
      onMessage(data){
        videoPlayer.feed(data);
      }
    });
  }
});

window.videoPlayer = videoPlayer;

const canvas = videoPlayer.canvas;
canvas.id = 'video-canvas';
$appContainer.appendChild(canvas);

const handleVisibilityChange = () => {
  if (document.hidden) {
    console.log('lost focus. stopping player');
    videoPlayer.pause();
  } else {
    console.log('got focus. starting player');
    videoPlayer.play();
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange, false);




const player = new AudioPlayer({
  encoding: '16bitInt',
  channels: 1,
  sampleRate: 16000,
  // flushingTime: 0
});

const audioStream = new StreamClient({
  url: `ws://${HOST}:8000`,
  onOpen(){
    console.log('Connected to audio stream');
  },
  onMessage(data){
    player.feed(data);
  }
});

window.player = player;


const $audioLevel = document.querySelector('#audio-level');
const $visualisationCanvas = createVisualiser({
  stream: player.gainNode,
  audioContext: player.audioCtx,
  canvas: $audioLevel,
});

