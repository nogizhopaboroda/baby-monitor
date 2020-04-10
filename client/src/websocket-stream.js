export default class WebsocketStream {
  get binaryType() {
    return 'arraybuffer';
  }

  get url() {
    return null;
  }

  constructor(options = {}) {
    this.options = options;
    this.createSocket();
  }
  createSocket() {
    const url = this.url || this.options.url;
    const ws = (this.ws = new WebSocket(url));
    ws.binaryType = this.binaryType;

    ws.onopen = this.onOpen.bind(this);
    ws.onmessage = this.onMessage.bind(this);
    ws.onerror = this.onError.bind(this);
  }
  onOpen() {
    this.options.onOpen && this.options.onOpen();
  }
  processData(data) {
    return new Uint8Array(data);
  }
  onData(data) {
    this.options.onData && this.options.onData(data);
  }
  onMessage(event) {
    const data = this.processData(event.data);
    this.onData(data);
  }
  onError(event) {}
}
