import {
  H264 as DesktopVideoPlayer,
  YUV as MobileVideoPlayer,
} from './video-player';
import AudioPlayer from './audio-player';
import createVisualiser from './audio-player/visualiser';
import WebsocketStream from './websocket-stream';
import NoSleep from 'nosleep.js';

const HOST = process.env.HOST || window.location.hostname;
const RAW_AUDIO_STREAMER_WS_PORT = process.env.RAW_AUDIO_STREAMER_WS_PORT || 8001;
const AUDIO_SAMPLE_RATE = process.env.AUDIO_SAMPLE_RATE || 16000;

const VIDEO_STREAMER_WS_PORT = process.env.VIDEO_STREAMER_WS_PORT || 9000;
const RAW_VIDEO_STREAMER_WS_PORT =
  process.env.RAW_VIDEO_STREAMER_WS_PORT || 9001;
const VIDEO_HEIGHT = process.env.VIDEO_HEIGHT || 640;
const VIDEO_WIDTH = process.env.VIDEO_WIDTH || 480;

const TEMP_HUMIDITY_STREAMER_WS_PORT =
  process.env.TEMP_HUMIDITY_STREAMER_WS_PORT || 7000;

const $appContainer = document.querySelector('#app-container');

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let videoPlayer;

if (isMobile) {
  videoPlayer = new MobileVideoPlayer({
    videoWidth: parseInt(VIDEO_WIDTH),
    videoHeight: parseInt(VIDEO_HEIGHT),
  });
  const noSleep = new NoSleep();
  const videoStream = new WebsocketStream({
    url: `ws://${HOST}:${RAW_VIDEO_STREAMER_WS_PORT}`,
    onOpen() {
      console.log('Connected to video stream');
      noSleep.enable();
    },
    onMessage(data) {
      videoPlayer.feed(data);
    },
  });
} else {
  videoPlayer = new DesktopVideoPlayer({
    onReady: () => {
      console.log('Video player is ready');
      const videoStream = new WebsocketStream({
        url: `ws://${HOST}:${VIDEO_STREAMER_WS_PORT}`,
        onOpen() {
          console.log('Connected to video stream');
        },
        onMessage(data) {
          videoPlayer.feed(data);
        },
      });
    },
  });
}

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
};

document.addEventListener('visibilitychange', handleVisibilityChange, false);

const player = new AudioPlayer({
  encoding: '16bitInt',
  channels: 1,
  sampleRate: parseInt(AUDIO_SAMPLE_RATE),
});

const audioStream = new WebsocketStream({
  url: `ws://${HOST}:${RAW_AUDIO_STREAMER_WS_PORT}`,
  onOpen() {
    console.log('Connected to audio stream');
  },
  onMessage(data) {
    player.feed(data);
  },
});

window.player = player;

const $audioLevel = document.querySelector('#audio-level');
const $visualisationCanvas = createVisualiser({
  stream: player.gainNode,
  audioContext: player.audioCtx,
  canvas: $audioLevel,
});
