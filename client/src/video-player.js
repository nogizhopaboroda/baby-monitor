import YUVBuffer from 'yuv-buffer';
import YUVCanvas from 'yuv-canvas';

export default class VideoPlayer {
  constructor(options) {
    const {
      onReady = () => {},
      canvas = document.createElement('canvas'),
    } = options;

    this.decoder = new Worker('./video-player-worker.js');

    this.canvas = canvas;

    this.yuv = YUVCanvas.attach(this.canvas);

    this.videoStreamId = 1;

    this.decoder.addEventListener('message', e => {
      const message =
        /** @type {{type:string, width:number, height:number, data:ArrayBuffer, renderStateId:number}} */ e.data;
      switch (message.type) {
        case 'pictureReady':
          this.onPictureReady(message);
          break;
        case 'decoderReady':
          onReady();
          break;
      }
    });
  }

  feed(data) {
    this.decode(data);
  }

  decode(data) {
    this.decoder.postMessage(
      {
        type: 'decode',
        data: data.buffer,
        offset: data.byteOffset,
        length: data.byteLength,
        renderStateId: this.videoStreamId,
      },
      [data.buffer],
    );
  }

  onPictureReady(message) {
    const {width, height, data} = message;
    this.onPicture(new Uint8Array(data), width, height);
  }

  onPicture(buffer, width, height) {
    const stride = width; // stride

    const sourceWidth = width;
    const sourceHeight = height;
    const maxXTexCoord = sourceWidth / stride;
    const maxYTexCoord = sourceHeight / height;

    const lumaSize = stride * height;
    const chromaSize = lumaSize >> 2;

    const yBuffer = buffer.subarray(0, lumaSize);
    const uBuffer = buffer.subarray(lumaSize, lumaSize + chromaSize);
    const vBuffer = buffer.subarray(
      lumaSize + chromaSize,
      lumaSize + 2 * chromaSize,
    );

    const chromaHeight = height >> 1;
    const chromaWidth = width >> 1;
    const chromaStride = stride >> 1;

    const format = YUVBuffer.format({
      // Absolutely required:
      width,
      height,

      // To use 4:2:0 layout, we set the chroma plane dimensions:
      chromaWidth,
      chromaHeight,
    });

    const y = { bytes: yBuffer, stride };
    const u = { bytes: uBuffer, stride: chromaStride };
    const v = { bytes: vBuffer, stride: chromaStride };

    const frame = YUVBuffer.frame(format, y, u, v);

    this.yuv.drawFrame(frame);
  }

  play() {}
  pause() {}
}
