import { PCMPlayer, MSEPlayer } from './audio-player';
import createVisualiser from './audio-player/visualiser';
import WebsocketStream from './websocket-stream';
import {volumeUp, volumeDown} from './icons';

import './components/video-player';
import './components/fullscreen-button';
import './components/temperature-humidity';


const HOST = process.env.HOST || window.location.hostname;
const AUDIO_STREAMER_WS_PORT =
  process.env.AUDIO_STREAMER_WS_PORT || 8000;
const RAW_AUDIO_STREAMER_WS_PORT =
  process.env.RAW_AUDIO_STREAMER_WS_PORT || 8001;
const AUDIO_SAMPLE_RATE = process.env.AUDIO_SAMPLE_RATE || 16000;
const AUDIO_CHANNELS = process.env.AUDIO_CHANNELS || 1;




const $appContainer = document.querySelector('#app-container');

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const videoPlayerElement = document.createElement('video-player');
videoPlayerElement.setAttribute('type', isMobile ? 'yuv' : 'h264');
$appContainer.appendChild(videoPlayerElement);

const videoPlayer = videoPlayerElement.player;


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

class AACAudioStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${AUDIO_STREAMER_WS_PORT}`;
  }

  onOpen() {
    console.log('Connected to AAC audio stream');
  }

  processData(data) {
    return data;
  }
}

const audioPlayer = new PCMPlayer({
  encoding: '16bitInt',
  channels: parseInt(AUDIO_CHANNELS),
  sampleRate: parseInt(AUDIO_SAMPLE_RATE),
});

const audioStream = new RawAudioStream({
  onData: data => audioPlayer.feed(data),
});

// const aacAudioPlayer = new MSEPlayer({ mimeType = 'audio/aac' });

// const aacAudioStream = new AACAudioStream({
  // onData: data => aacAudioPlayer.feed(data),
// });

window.audioPlayer = audioPlayer;

const $audioLevel = document.querySelector('#audio-level');
const $visualisationCanvas = createVisualiser({
  stream: audioPlayer.mediaStreamSource,
  audioContext: audioPlayer.audioCtx,
  canvas: $audioLevel,
});


/* volume */


const $volumeValue = document.querySelector('#volume-value');
const updateValue = () => {
  $volumeValue.innerText = audioPlayer.gainNode.gain.value;
};

const $volumeUp = document.querySelector('#volume-up');
$volumeUp.innerHTML = volumeUp;
$volumeUp.addEventListener('click', () => {
  audioPlayer.gainNode.gain.value += 1;
  updateValue();
});

const $volumeDown = document.querySelector('#volume-down');
$volumeDown.innerHTML = volumeDown;
$volumeDown.addEventListener('click', () => {
  audioPlayer.gainNode.gain.value && (audioPlayer.gainNode.gain.value -= 1);
  updateValue();
});

updateValue();
