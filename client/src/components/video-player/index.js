import WebsocketStream from '../../websocket-stream';
import {
  H264Player,
  YUVPlayer,
} from '../../video-player';


const HOST = process.env.HOST || window.location.hostname;
const VIDEO_HEIGHT = process.env.VIDEO_HEIGHT || 640;
const VIDEO_WIDTH = process.env.VIDEO_WIDTH || 480;


class VideoPlayerComponent extends HTMLElement {
  constructor(){
    super();
  }

  connectedCallback(){
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'video-canvas';
    this.appendChild(this.canvas);

    this.type = this.getAttribute('type');

    switch(this.type){
      case 'h264':
        this.player = new H264Player({
          canvas: this.canvas,
          onReady: () => console.log('Video player is ready'),
        });

        this.stream = new Worker('./h264.stream.worker.js');
        this.stream.addEventListener('message', ({ data }) => this.player.feed(data));

        break;
      case 'yuv':
      default:
        this.player = new YUVPlayer({
          canvas: this.canvas,
          videoWidth: parseInt(VIDEO_WIDTH),
          videoHeight: parseInt(VIDEO_HEIGHT),
        });

        this.stream = new Worker('./yuv.stream.worker.js');
        this.stream.addEventListener('message', ({ data }) => this.player.feed(data));
        break;
    }
  }
}

customElements.define('video-player', VideoPlayerComponent);
