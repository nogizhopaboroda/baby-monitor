import WebsocketStream from '../../websocket-stream';
import {HOST, RAW_VIDEO_STREAMER_WS_PORT} from '../../config';


class YUVVideoStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${RAW_VIDEO_STREAMER_WS_PORT}`;
  }

  onOpen() {
    console.log('Connected to YUV video stream');
  }
}

const yuvStream = new YUVVideoStream({
  onData: data => postMessage(data),
});
