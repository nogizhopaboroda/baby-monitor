import { H264 as VideoPlayer } from './video-player';
import AudioPlayer from './audio-player';
import createVisualiser from './audio-player/visualiser';
import WebsocketStream from './websocket-stream';

const HOST = process.env.HOST || window.location.hostname;
const AUDIO_STREAMER_WS_PORT = process.env.AUDIO_STREAMER_WS_PORT || 8000;
const VIDEO_STREAMER_WS_PORT = process.env.VIDEO_STREAMER_WS_PORT || 8001;
const RAW_VIDEO_STREAMER_WS_PORT = process.env.RAW_VIDEO_STREAMER_WS_PORT || 8002;
const TEMP_HUMIDITY_STREAMER_WS_PORT = process.env.TEMP_HUMIDITY_STREAMER_WS_PORT || 8003;
const AUDIO_SAMPLE_RATE = process.env.AUDIO_SAMPLE_RATE || 16000;

const $appContainer = document.querySelector('#app-container');



const videoPlayer = new VideoPlayer({
  onReady: () => {
    console.log('Video player is ready');
    const videoStream = new WebsocketStream({
      url: `ws://${HOST}:${VIDEO_STREAMER_WS_PORT}`,
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
  sampleRate: AUDIO_SAMPLE_RATE,
});

const audioStream = new WebsocketStream({
  url: `ws://${HOST}:${AUDIO_STREAMER_WS_PORT}`,
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

