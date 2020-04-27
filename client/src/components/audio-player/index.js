import {PCMPlayer, MSEPlayer} from '../../audio-player';
import createVisualiser from '../../audio-player/visualiser';
import {volumeUp, volumeDown} from '../../icons';

const AUDIO_SAMPLE_RATE = process.env.AUDIO_SAMPLE_RATE || 16000;
const AUDIO_CHANNELS = process.env.AUDIO_CHANNELS || 1;

class AudioPlayerComponent extends HTMLElement {

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

    this.render();
  }

  render() {
    this.audioLevel = document.createElement('canvas');
    this.audioLevel.id = 'audio-level';
    const $visualisationCanvas = createVisualiser({
      stream: this.player.mediaStreamSource,
      audioContext: this.player.audioCtx,
      canvas: this.audioLevel,
    });

    this.appendChild(this.audioLevel);

    /* volume */

    this.volumeValue = document.createElement('div');
    this.volumeValue.id = 'volume-value';
    const updateValue = () => {
      this.volumeValue.innerText = this.player.gainNode.gain.value;
    };

    this.volumeUp = document.createElement('div');
    this.volumeUp.id = 'volume-up';
    this.volumeUp.classList.add('app-icon');
    this.volumeUp.innerHTML = volumeUp;
    this.volumeUp.addEventListener('click', () => {
      this.player.gainNode.gain.value += 1;
      updateValue();
    });

    this.volumeDown = document.createElement('div');
    this.volumeDown.id = 'volume-down';
    this.volumeDown.classList.add('app-icon');
    this.volumeDown.innerHTML = volumeDown;
    this.volumeDown.addEventListener('click', () => {
      this.player.gainNode.gain.value && (this.player.gainNode.gain.value -= 1);
      updateValue();
    });

    const volumeWrapper = document.createElement('div');
    volumeWrapper.id = 'volume';
    volumeWrapper.appendChild(this.volumeUp);
    volumeWrapper.appendChild(this.volumeValue);
    volumeWrapper.appendChild(this.volumeDown);

    this.appendChild(volumeWrapper);

    updateValue();
  }
}

customElements.define('audio-player', AudioPlayerComponent);