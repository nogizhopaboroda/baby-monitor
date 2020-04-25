import WebsocketStream from '../../websocket-stream';


const HOST = process.env.HOST || self.location.hostname;
const AUDIO_STREAMER_WS_PORT = process.env.AUDIO_STREAMER_WS_PORT || 8000;

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
