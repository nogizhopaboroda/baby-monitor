import {
  H264 as DesktopVideoPlayer,
  YUV as MobileVideoPlayer,
} from './video-player';
import RawAudioPlayer from './audio-player';
import createVisualiser from './audio-player/visualiser';
import WebsocketStream from './websocket-stream';
import NoSleep from 'nosleep.js';

const HOST = process.env.HOST || window.location.hostname;
const RAW_AUDIO_STREAMER_WS_PORT =
  process.env.RAW_AUDIO_STREAMER_WS_PORT || 8001;
const AUDIO_SAMPLE_RATE = process.env.AUDIO_SAMPLE_RATE || 16000;
const AUDIO_CHANNELS = process.env.AUDIO_CHANNELS || 1;

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

class RawVideoStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${RAW_VIDEO_STREAMER_WS_PORT}`;
  }

  onOpen() {
    console.log('Connected to raw video stream');
  }
}

class H264VideoStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${VIDEO_STREAMER_WS_PORT}`;
  }

  onOpen() {
    console.log('Connected to H264 video stream');
  }
}

if (isMobile) {
  const noSleep = new NoSleep();
  noSleep.enable();

  videoPlayer = new MobileVideoPlayer({
    videoWidth: parseInt(VIDEO_WIDTH),
    videoHeight: parseInt(VIDEO_HEIGHT),
  });

  const videoStream = new RawVideoStream({
    onData: data => videoPlayer.feed(data),
  });
} else {
  videoPlayer = new DesktopVideoPlayer({
    onReady: () => console.log('Video player is ready'),
  });

  const videoStream = new H264VideoStream({
    onData: data => videoPlayer.feed(data),
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

class RawAudioStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${RAW_AUDIO_STREAMER_WS_PORT}`;
  }

  onOpen() {
    console.log('Connected to raw audio stream');
  }
}

const audioPlayer = new RawAudioPlayer({
  encoding: '16bitInt',
  channels: parseInt(AUDIO_CHANNELS),
  sampleRate: parseInt(AUDIO_SAMPLE_RATE),
});

const audioStream = new RawAudioStream({
  onData: data => audioPlayer.feed(data),
});

window.audioPlayer = audioPlayer;

const $audioLevel = document.querySelector('#audio-level');
const $visualisationCanvas = createVisualiser({
  stream: audioPlayer.gainNode,
  audioContext: audioPlayer.audioCtx,
  canvas: $audioLevel,
});


class TempHumidityStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${TEMP_HUMIDITY_STREAMER_WS_PORT}`;
  }

  processData(data){
    return String.fromCharCode.apply(null, new Uint8Array(data))
  }

  onOpen() {
    console.log('Connected to temp/humidity stream');
  }
}

const $tempHumiduty = document.querySelector('#temp-humidity');

const tempHumidityStream = new TempHumidityStream({
  onData: (data) => {
    const [temp, humidity] = data.split(' ');
    $tempHumiduty.innerHTML = `
      <div>${temp}°</div>
      <div>${humidity}%</div>`;
  }
})
