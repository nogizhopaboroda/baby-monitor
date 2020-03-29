import YUVBuffer from 'yuv-buffer';
import YUVCanvas from 'yuv-canvas';

export class YUV {
  constructor(options) {
    const {
      canvas = document.createElement('canvas'),
      videoWidth = 320,
      videoHeight = 210,
      displayHeight,
      displayWidth,
    } = options;

    this.canvas = canvas;

    this.yuv = YUVCanvas.attach(this.canvas);

    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    this.displayHeight = displayHeight;
    this.displayWidth = displayWidth;
  }

  feed(data) {
    this.onPicture(data, this.videoWidth, videoHeight);
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

      displayHeight: this.displayHeight,
      displayWidth: this.displayWidth,
    });

    const y = {bytes: yBuffer, stride};
    const u = {bytes: uBuffer, stride: chromaStride};
    const v = {bytes: vBuffer, stride: chromaStride};

    const frame = YUVBuffer.frame(format, y, u, v);

    this.yuv.drawFrame(frame);
  }
}

export class H264 extends YUV {
  constructor(options) {
    super(options);

    const {
      onReady = () => {},
      isPlaying = true,
    } = options;

    this.isPlaying = isPlaying;

    this.decoder = new Worker('./worker.js');

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
    if(!this.isPlaying){
      return;
    }
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

  play() {
    this.isPlaying = true;
  }
  pause() {
    this.isPlaying = false;
  }
}
