import WSAvcPlayer from 'ws-avc-player';
// Create h264 player
var uri = "ws://" + '192.168.1.90:8070/video-stream';
var wsavc = new WSAvcPlayer();
wsavc.connect(uri);
//expose instance for button callbacks
window.wsavc = wsavc;

const canvas = document.body.appendChild(wsavc.AvcPlayer.canvas);
document.body.appendChild(canvas);
