import WebsocketStream from '../../websocket-stream';
import {HOST, RAW_AUDIO_STREAMER_WS_PORT} from '../../config';


class RawAudioStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${RAW_AUDIO_STREAMER_WS_PORT}`;
  }

  onOpen() {
    console.log('Connected to raw audio stream');
  }
}

const rawAudioStream = new RawAudioStream({
  onData: data => postMessage(data),
});
