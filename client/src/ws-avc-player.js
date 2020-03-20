'use strict';




const {Player} = require('broadway-player');

const log = console.log;
class WSAvcPlayer {
  constructor({useWorker, workerFile} = {}) {
    // this.canvas = canvas
    // this.canvastype = canvastype
    // this.worker = new Worker('./worker.js');

    // this.worker.onmessage = (event) => this.feed(event.data);

    this.AvcPlayer = new Player({
      useWorker,
      workerFile,
      size: {
        width: 640,
        height: 368,
      },
    });
    this.width = 1280;
    this.height = 1024;
    this.AvcPlayer.onPictureDecoded = (_, w, h) => {
      if (w !== this.width || h !== this.height) {
        // this.emit('resized', { width: w, height: h })
        this.width = w;
        this.height = h;
      }
    };

    this.framesList = [];
    this.running = true;
    this.shiftFrameTimeout = null;
  }

  get shiftFrame() {
    return () => {
      if (!this.running) return;

      if (this.framesList.length > 30) {
        console.log('Dropping frames', this.framesList.length);
        const vI = this.framesList.findIndex(e => (e[4] & 0x1f) === 7);
        // console.log('Dropping frames', framesList.length, vI)
        if (vI >= 0) {
          this.framesList = this.framesList.slice(vI);
        }
        // framesList = []
      }

      const frame = this.framesList.shift();
      // this.emit('frame_shift', this.framesList.length)

      if (frame) {
        this.AvcPlayer.decode(frame);
      }

      // requestAnimationFrame(this.shiftFrame);
      // this.shiftFrameTimeout = setTimeout(this.shiftFrame, 1)
    };
  }

  feedRaw(chunk) {
    // this.worker.postMessage(chunk);
  }

  feed(frame) {
    // const frame = new Uint8Array(evt.data)
    // console.log("[Pkt " + this.pktnum + " (" + evt.data.byteLength + " bytes)]");
    // this.decode(frame);
    if (this.running) {
      this.framesList.push(frame);
      // this.running = true;
      // clearTimeout(this.shiftFrameTimeout);
      // this.shiftFrameTimeout = null;
      // this.shiftFrameTimeout = setTimeout(this.shiftFrame, 1);
      window.cancelAnimationFrame(this.raf)
      this.raf = window.requestAnimationFrame(this.shiftFrame);
    }
  }

  pause(){
    this.running = false;
  }

  play(){
    this.running = true;
  }
}
export default WSAvcPlayer;
