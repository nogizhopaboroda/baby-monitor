import { PCMPlayer, MSEPlayer } from './audio-player';
import WebsocketStream from './websocket-stream';

import './components/video-player';
import './components/audio-player';
import './components/fullscreen-button';
import './components/temperature-humidity';



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

const audioPlayerElement = document.createElement('audio-player');
audioPlayerElement.setAttribute('type', isMobile ? 'aac' : 'raw');
$appContainer.appendChild(audioPlayerElement);

