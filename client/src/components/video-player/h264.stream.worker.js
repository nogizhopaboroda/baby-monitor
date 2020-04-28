import WebsocketStream from '../../websocket-stream';
import {HOST, VIDEO_STREAMER_WS_PORT} from '../../config';


class H264VideoStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${VIDEO_STREAMER_WS_PORT}`;
  }

  onOpen() {
    console.log('Connected to H264 video stream');
  }
}

const h264Stream = new H264VideoStream({
  onData: data => postMessage(data),
});
