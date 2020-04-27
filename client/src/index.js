import './components/video-player';
import './components/audio-player';
import './components/fullscreen-button';
import './components/temperature-humidity';

class ApplicationController extends HTMLElement {
  connectedCallback() {

    const handleVisibilityChange = () => {
      const videoPlayerElement = this.querySelector('video-player');
      if (document.hidden) {
        console.log('lost focus. stopping player');
        videoPlayerElement.player.pause();
      } else {
        console.log('got focus. starting player');
        videoPlayerElement.player.play();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
      false,
    );

    this.render();
  }

  render() {
    this.innerHTML = `
      <video-player type="${this.isMobile() ? 'yuv' : 'h264'}"></video-player>
      <audio-player type="${this.isMobile() ? 'aac' : 'raw'}"></audio-player>
      <temperature-humidity id="temp-humidity"></temperature-humidity>
      <fullscreen-button id="fullscreen-button" class="app-icon"></fullscreen-button>
    `;
  }

  isMobile(){
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }
}

customElements.define('application-controller', ApplicationController);
