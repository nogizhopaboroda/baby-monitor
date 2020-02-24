import WSAvcPlayer from './ws-avc-player';
import PCMPlayer from './pcm-player';
import createVisualiser from './visualiser';

import muxjs from 'mux.js';
// const muxjs = require("mux.js");
let transmuxer = new muxjs.mp4.Transmuxer({ 'remux': false });
var aa = new muxjs.codecs.h264.H264Stream();
// debugger;
// console.log(muxjs);
window.muxjs = muxjs
// debugger;

transmuxer.on("data", function(segment) {
console.log(456);
debugger;
});

aa.on("data", function(segment) {
console.log(8989);
debugger;
});

const HOST = process.env.HOST || window.location.hostname;
const PORT = process.env.PORT || window.location.port;

const $appContainer = document.querySelector('#app-container');


let tmpA = new Uint8Array();
let arrs = [];

class StreamClient {
  constructor(options = {}){
    this.options = options;
    this.createSocket();
  }
  createSocket(){
    const { url } = this.options;
    const ws = this.ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';

    ws.onopen = this.onOpen.bind(this);
    ws.onmessage = this.onMessage.bind(this);
  }
  onOpen(){
    this.options.onOpen && this.options.onOpen();
  }
  onMessage(event){
    const data = new Uint8Array(event.data);
    this.options.onMessage && this.options.onMessage(data);
  }
}

const wsavc = new WSAvcPlayer();

let i = 0;
const videoStream = new StreamClient({
  url: `ws://${HOST}:8002`,
  onOpen(){
    wsavc.framesList = []
    console.log('Connected to video stream');
  },
  onMessage(data){
    //TODO: this can be optimised
    tmpA = Int8Array.from([...tmpA, ...data])
    const index = tmpA.findIndex(function (element, index, array) {
      return element === 0 && array[index + 1] === 0 && array[index + 2] === 0  && array[index + 3] === 1;
    })
    if(~index){
      const chunk = tmpA.slice(0, index);
      tmpA = tmpA.slice(index + 4);
      console.log('got chunk');
      wsavc.feed(chunk);
    }
  }
});

const canvas = wsavc.AvcPlayer.canvas;
$appContainer.appendChild(canvas);



const player = new PCMPlayer({
  encoding: '16bitInt',
  channels: 1,
  sampleRate: 16000,
  // flushingTime: 0
});

const audioStream = new StreamClient({
  url: `ws://${HOST}:8000`,
  onOpen(){
    console.log('Connected to audio stream');
  },
  onMessage(data){
    player.feed(data);
  }
});

window.player = player;


const $audioLevel = document.querySelector('#audio-level');
const $visualisationCanvas = createVisualiser({
  stream: player.gainNode,
  audioContext: player.audioCtx,
  canvas: $audioLevel,
});

