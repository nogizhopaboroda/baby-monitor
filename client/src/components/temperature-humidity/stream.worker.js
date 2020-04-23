import WebsocketStream from '../../websocket-stream';

const HOST = process.env.HOST || window.location.hostname;
const TEMP_HUMIDITY_STREAMER_WS_PORT =
  process.env.TEMP_HUMIDITY_STREAMER_WS_PORT || 7000;

class TempHumidityStream extends WebsocketStream {
  get url() {
    return `ws://${HOST}:${TEMP_HUMIDITY_STREAMER_WS_PORT}`;
  }

  processData(data) {
    const dataString = String.fromCharCode.apply(null, new Uint8Array(data));
    const [temperature, humidity] = dataString.split(' ');
    return {temperature, humidity};
  }

  onOpen() {
    console.log('Connected to temp/humidity stream');
  }
}

const tempHumidityStream = new TempHumidityStream({
  onData: (data) => postMessage(data),
});
