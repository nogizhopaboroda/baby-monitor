import WebsocketStream from '../../websocket-stream';
import {HOST, AUDIO_STREAMER_WS_PORT} from '../../config';


class AACAudioStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${AUDIO_STREAMER_WS_PORT}`;
  }

  onOpen() {
    console.log('Connected to AAC audio stream');
  }

  processData(data) {
    return data;
  }
}

const aacAudioStream = new AACAudioStream({
  onData: data => postMessage(data),
});
