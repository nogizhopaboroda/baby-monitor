import NoiseGateNode from 'noise-gate';
import format from 'audio-format';
import convert from 'pcm-convert';

export class PCMPlayer {
  constructor(options) {
    const defaults = {
      encoding: 'int16',
      channels: 1,
      sampleRate: 8000,
    };
    this.options = {...defaults, ...options};

    this.formatString = format.stringify({
      type: 'int16',
      endianness: 'le',
      interleaved: true,
      channels: this.options.channels,
      sampleRate: this.options.sampleRate,
    });

    this.audioDataFloat = (new Array(this.options.channels)).fill([]);

    this.createContext();

    if(this.options.filtering){
      this.setFiltering();
    }
  }

  createContext() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.mediaStreamDestination = this.audioCtx.createMediaStreamDestination();
    this.mediaStreamSource = this.audioCtx.createMediaStreamSource(
      this.mediaStreamDestination.stream,
    );

    this.gainNode = this.audioCtx.createGain();

    this.gainNode.gain.value = 1;

    this.noiseGate = new NoiseGateNode(this.audioCtx);

    this.generator = this.audioCtx.createScriptProcessor(this.options.bufferSize, this.options.channels, this.options.channels);

    const bufferSize = this.generator.bufferSize;
    const maxBufferSize = bufferSize * 48;

    this.generator.onaudioprocess = ({ outputBuffer }) => {

      for (let channel = 0; channel < this.options.channels; channel++) {
        const buf = this.audioDataFloat[channel].splice(0, bufferSize);
        if (!buf.length) {
          const inputBuffer = new Float32Array(bufferSize);
          outputBuffer.getChannelData(channel).set(inputBuffer);
          return;
        }
        const inputBuffer = new Float32Array(buf);

        outputBuffer.getChannelData(channel).set(inputBuffer);

        if (this.audioDataFloat[channel].length > maxBufferSize) {
          console.log('flushing buffer');
          this.audioDataFloat = (new Array(this.options.channels)).fill([]);
        }
      }
    };


    this.generator.connect(this.mediaStreamDestination);

    this.mediaStreamSource.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
  }

  setFiltering(state = true) {
    if (state) {
      this.gainNode.disconnect(this.audioCtx.destination);
      this.gainNode.connect(this.noiseGate);
      this.noiseGate.connect(this.audioCtx.destination);
    } else {
      this.gainNode.disconnect(this.noiseGate);
      this.noiseGate.disconnect(this.audioCtx.destination);
      this.gainNode.connect(this.audioCtx.destination);
    }
  }

  volume(volume) {
    this.gainNode.gain.value = volume;
  }

  destroy() {
    this.audioCtx.close();
    this.audioCtx = null;
  }

  feed(data) {
    const source = convert(data, this.formatString, 'float32');

    const channels = this.options.channels;
    const length = Math.floor(source.length / channels);
    const channelsData = [];
    for (let channel = 0; channel < channels; channel++) {
      channelsData[channel] = source.subarray(
        channel * length,
        (channel + 1) * length,
      );
    }

    this.play(channelsData);
  }

  play(channelsData) {
    for (let channel = 0; channel < channelsData.length; channel++) {
      for (let i = 0; i < channelsData[channel].length; i++) {
        this.audioDataFloat[channel].push(channelsData[channel][i]);
      }
    }
    return;
  }
}

// taken from https://github.com/SamuelFisher/WebSocketAudio
export class MSEPlayer {
  constructor({mimeType = 'audio/aac'} = {}) {
    this.audioElement = new Audio();
    this.audioElement.autoplay = true;

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.mediaStreamSource = this.audioCtx.createMediaElementSource(
      this.audioElement,
    );

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 1;

    this.mediaStreamSource.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.audio = this.audioElement;
    // Set audio element source
    var mediaSource = new MediaSource();
    this.audio.src = window.URL.createObjectURL(mediaSource);
    this.isFirstBlock = true;
    this.queue = [];
    mediaSource.addEventListener('sourceopen', () => {
      this.sourceBuffer = mediaSource.addSourceBuffer(mimeType);
      this.sourceBuffer.addEventListener('updateend', () => {
        this.appendBlock(); // Get a chance to clean up old audio
      });

      this.isReady = true;
    });
  }

  onReady() {}

  feed(data) {
    if (!this.isReady) {
      return;
    }
    this.queue.push(data);
    this.appendBlock();
  }

  onUpdate(currentTime, bufferedTime) {
    if (!this.isPlaying) {
      this.audioElement.currentTime = bufferedTime;
      this.isPlaying = true;
    }
    const diff = bufferedTime - currentTime;
    if (diff > 0.35) {
      console.log('should sync');
      this.audioElement.currentTime = bufferedTime;
    }
    // console.log(currentTime, bufferedTime, diff);
  }

  appendBlock() {
    if (this.sourceBuffer.updating) return;
    if (
      this.queue.length == 0 &&
      this.audio.currentTime > 2 &&
      this.audio.currentTime > this.sourceBuffer.buffered.start(0) + 5
    ) {
      // Remove audio already listened to
      this.sourceBuffer.remove(0, this.audio.currentTime - 1);
      return;
    }
    if (this.queue.length == 0) {
      // Nothing to do
      return;
    }
    // Determine next append time
    var appendTime = 0;
    if (!this.isFirstBlock) {
      appendTime = this.sourceBuffer.buffered.end(0);
    }
    this.isFirstBlock = false;
    // Append audio segment
    this.sourceBuffer.timestampOffset = appendTime;
    this.sourceBuffer.appendBuffer(this.queue.shift());
    // Update stats
    this.onUpdate(this.audio.currentTime, appendTime);
  }
}
