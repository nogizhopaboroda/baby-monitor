import WSAvcPlayer from 'ws-avc-player';

const {HOST = window.location.hostname, PORT = window.location.port} = process.env;

// Create h264 player
var uri = `ws://${HOST}:${PORT}/video-stream`;
var wsavc = new WSAvcPlayer();
wsavc.connect(uri);
//expose instance for button callbacks
window.wsavc = wsavc;

const canvas = document.body.appendChild(wsavc.AvcPlayer.canvas);
document.body.appendChild(canvas);
