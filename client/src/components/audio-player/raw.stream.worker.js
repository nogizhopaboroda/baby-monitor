import WebsocketStream from '../../websocket-stream';


const HOST = process.env.HOST || self.location.hostname;
const RAW_AUDIO_STREAMER_WS_PORT =
  process.env.RAW_AUDIO_STREAMER_WS_PORT || 8001;

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
