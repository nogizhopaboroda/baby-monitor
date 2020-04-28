import WebsocketStream from '../../websocket-stream';
import {HOST, TEMP_HUMIDITY_STREAMER_WS_PORT} from '../../config';


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
