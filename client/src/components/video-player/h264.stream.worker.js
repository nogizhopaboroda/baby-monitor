import WebsocketStream from '../../websocket-stream';


const HOST = process.env.HOST || window.location.hostname;
const VIDEO_STREAMER_WS_PORT = process.env.VIDEO_STREAMER_WS_PORT || 9000;


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
