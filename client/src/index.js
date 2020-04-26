import './components/video-player';
import './components/audio-player';
import './components/fullscreen-button';
import './components/temperature-humidity';



const $appContainer = document.querySelector('#app-container');

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

$appContainer.innerHTML = `
  <video-player type="${isMobile ? 'yuv' : 'h264'}"></video-player>
  <audio-player type="${isMobile ? 'aac' : 'raw'}"></audio-player>
  <temperature-humidity id="temp-humidity"></temperature-humidity>
  <fullscreen-button id="fullscreen-button" class="app-icon"></fullscreen-button>
`;

const videoPlayerElement = $appContainer.querySelector('video-player');
videoPlayerElement.setAttribute('type', isMobile ? 'yuv' : 'h264');
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

