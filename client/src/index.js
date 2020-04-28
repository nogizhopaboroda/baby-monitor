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
    const currentUrl = new URL(window.location.href);
    const videoFormat =
      currentUrl.searchParams.get('video') || (this.isMobile() ? 'yuv' : 'h264');
    const audioFormat =
      currentUrl.searchParams.get('audio') || (this.isMobile() ? 'aac' : 'raw');

    this.innerHTML = `
      <video-player type="${videoFormat}"></video-player>
      <audio-player type="${audioFormat}"></audio-player>
      <temperature-humidity id="temp-humidity"></temperature-humidity>
      <fullscreen-button id="fullscreen-button" class="app-icon"></fullscreen-button>
    `;
  }

  isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }
}

customElements.define('application-controller', ApplicationController);
