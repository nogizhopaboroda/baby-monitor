import WSAvcPlayer from 'ws-avc-player';

const HOST = process.env.HOST || window.location.hostname;
const PORT = process.env.PORT || window.location.port;

// Create h264 player
var uri = `ws://${HOST}:${PORT}/video-stream`;
var wsavc = new WSAvcPlayer();
wsavc.connect(uri);
//expose instance for button callbacks
window.wsavc = wsavc;

const canvas = document.body.appendChild(wsavc.AvcPlayer.canvas);
document.body.appendChild(canvas);


const audioElement = new Audio(`http://${HOST}:${PORT}/audio`);
audioElement.controls = true;
audioElement.preload = 'none';
document.body.appendChild(audioElement);
