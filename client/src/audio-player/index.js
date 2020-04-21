// taken from https://github.com/samirkumardas/pcm-player

import NoiseGateNode from 'noise-gate';

const dBFSToGain = dbfs => Math.pow(10, dbfs / 20);

export class PCMPlayer {
  constructor(options) {
    this.init(options);
  }

  init(option) {
    const defaults = {
      encoding: '16bitInt',
      channels: 1,
      sampleRate: 8000,
    };
    this.options = {...defaults, ...option};
    this.maxValue = this.getMaxValue();
    this.typedArray = this.getTypedArray();
    this.createContext();
  }

  getMaxValue() {
    const encodings = {
      '8bitInt': 128,
      '16bitInt': 32768,
      '32bitInt': 2147483648,
      '32bitFloat': 1,
    };

    return encodings[this.options.encoding]
      ? encodings[this.options.encoding]
      : encodings['16bitInt'];
  }

  getTypedArray() {
    const typedArrays = {
      '8bitInt': Int8Array,
      '16bitInt': Int16Array,
      '32bitInt': Int32Array,
      '32bitFloat': Float32Array,
    };

    return typedArrays[this.options.encoding]
      ? typedArrays[this.options.encoding]
      : typedArrays['16bitInt'];
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

  isTypedArray(data) {
    return (
      data.byteLength && data.buffer && data.buffer.constructor == ArrayBuffer
    );
  }

  feed(data) {
    if (!this.isTypedArray(data)) return;

    this.flush(this.getFormatedValue(data));
  }

  getFormatedValue(data) {
    const outputData = new this.typedArray(data.buffer);
    const float32 = new Float32Array(data.length);

    for (let i = 0; i < outputData.length; i++) {
      float32[i] = outputData[i] / this.maxValue;
    }
    return float32;
  }

  volume(volume) {
    this.gainNode.gain.value = volume;
  }

  destroy() {
    this.audioCtx.close();
    this.audioCtx = null;
  }

  flush(sample) {
    if (!sample.length) return;
    let bufferSource = this.audioCtx.createBufferSource(),
      length = sample.length / this.options.channels,
      audioBuffer = this.audioCtx.createBuffer(
        this.options.channels,
        length,
        this.options.sampleRate,
      ),
      audioData,
      channel,
      offset,
      i,
      decrement;

    for (channel = 0; channel < this.options.channels; channel++) {
      audioData = audioBuffer.getChannelData(channel);
      offset = channel;
      decrement = 50;
      for (i = 0; i < length; i++) {
        audioData[i] = sample[offset];
        /* fadein */
        if (i < 50) {
          audioData[i] = (audioData[i] * i) / 50;
        }
        /* fadeout*/
        if (i >= length - 51) {
          audioData[i] = (audioData[i] * decrement--) / 50;
        }
        offset += this.options.channels;
      }
    }

    bufferSource.buffer = audioBuffer;
    bufferSource.connect(this.mediaStreamDestination);
    bufferSource.start(this.audioCtx.currentTime);
  }
}

// taken from https://github.com/SamuelFisher/WebSocketAudio
export class MSEPlayer {
  constructor({ mimeType = 'audio/aac' } = {}) {
    this.audioElement = new Audio();
    this.audioElement.autoplay = true;

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.mediaStreamSource = this.audioCtx.createMediaElementSource(this.audioElement)

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
    if(!this.isReady){
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
