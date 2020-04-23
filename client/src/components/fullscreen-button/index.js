import NoSleep from 'nosleep.js';
import {fullScreen, fullScreenExit} from '../../icons';

const noSleep = new NoSleep();

class FullScreenButtonComponent extends HTMLElement {
  connectedCallback() {
    this.render();

    this.addEventListener('click', () => {
      if (this.isFullScreen()) {
        document.exitFullscreen().then(() => {
          noSleep.disable();
          screen.orientation.unlock();
        });
      } else {
        document.documentElement.requestFullscreen().then(() => {
          noSleep.enable();
          screen.orientation.lock('landscape');
        });
      }
    });

    document.addEventListener('fullscreenchange', () => this.render());
  }

  isFullScreen() {
    return !!document.fullscreenElement;
  }

  render() {
    if (this.isFullScreen()) {
      this.innerHTML = fullScreenExit;
    } else {
      this.innerHTML = fullScreen;
    }
  }
}

customElements.define('fullscreen-button', FullScreenButtonComponent);
