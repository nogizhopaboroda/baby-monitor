import {PCMPlayer, MSEPlayer} from '../../audio-player';
import createVisualiser from '../../audio-player/visualiser';
import {volumeUp, volumeDown} from '../../icons';

const HOST = process.env.HOST || window.location.hostname;
const AUDIO_SAMPLE_RATE = process.env.AUDIO_SAMPLE_RATE || 16000;
const AUDIO_CHANNELS = process.env.AUDIO_CHANNELS || 1;

class AudioPlayerComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.type = this.getAttribute('type');

    switch (this.type) {
      case 'aac':
        this.player = new MSEPlayer({mimeType: 'audio/aac'});

        this.stream = new Worker('./aac.stream.worker.js');
        this.stream.addEventListener('message', ({data}) =>
          this.player.feed(data),
        );

        break;
      case 'raw':
      default:
        this.player = new PCMPlayer({
          encoding: '16bitInt',
          channels: parseInt(AUDIO_CHANNELS),
          sampleRate: parseInt(AUDIO_SAMPLE_RATE),
        });

        this.stream = new Worker('./raw.stream.worker.js');
        this.stream.addEventListener('message', ({data}) =>
          this.player.feed(data),
        );
        break;
    }

    this.misc();
  }

  misc() {
    const $audioLevel = document.querySelector('#audio-level');
    const $visualisationCanvas = createVisualiser({
      stream: this.player.mediaStreamSource,
      audioContext: this.player.audioCtx,
      canvas: $audioLevel,
    });

    /* volume */

    const $volumeValue = document.querySelector('#volume-value');
    const updateValue = () => {
      $volumeValue.innerText = this.player.gainNode.gain.value;
    };

    const $volumeUp = document.querySelector('#volume-up');
    $volumeUp.innerHTML = volumeUp;
    $volumeUp.addEventListener('click', () => {
      this.player.gainNode.gain.value += 1;
      updateValue();
    });

    const $volumeDown = document.querySelector('#volume-down');
    $volumeDown.innerHTML = volumeDown;
    $volumeDown.addEventListener('click', () => {
      this.player.gainNode.gain.value && (this.player.gainNode.gain.value -= 1);
      updateValue();
    });

    updateValue();
  }
}

customElements.define('audio-player', AudioPlayerComponent);
