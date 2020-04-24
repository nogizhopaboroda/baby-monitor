import WebsocketStream from '../../websocket-stream';

const HOST = process.env.HOST || window.location.hostname;
const RAW_VIDEO_STREAMER_WS_PORT =
  process.env.RAW_VIDEO_STREAMER_WS_PORT || 9001;

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
