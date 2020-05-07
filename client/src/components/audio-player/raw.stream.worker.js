import format from 'audio-format';
import convert from 'pcm-convert';
import WebsocketStream from '../../websocket-stream';
import {
  HOST,
  RAW_AUDIO_STREAMER_WS_PORT,
  RAW_AUDIO_SAMPLE_RATE,
  AUDIO_CHANNELS,
} from '../../config';

const channels = parseInt(AUDIO_CHANNELS);
const sampleRate = parseInt(RAW_AUDIO_SAMPLE_RATE);
const formatString = format.stringify({
  type: 'int16',
  endianness: 'le',
  interleaved: true,
  channels: channels,
  sampleRate: sampleRate,
});

class RawAudioStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${RAW_AUDIO_STREAMER_WS_PORT}`;
  }

  onOpen() {
    console.log('Connected to raw audio stream');
  }

  processData(data) {
    const source = convert(data, formatString, 'float32');

    const length = Math.floor(source.length / channels);
    const channelsData = [];
    for (let channel = 0; channel < channels; channel++) {
      channelsData[channel] = source.subarray(
        channel * length,
        (channel + 1) * length,
      );
    }
    return channelsData;
  }
}

const rawAudioStream = new RawAudioStream({
  onData: data => postMessage(data),
});
