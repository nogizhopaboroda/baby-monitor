import fs from 'fs';

export const fullScreen = fs.readFileSync(__dirname + '/fullscreen.svg', 'utf8');
export const fullScreenExit = fs.readFileSync(__dirname + '/fullscreen-exit.svg', 'utf8');
export const volumeUp = fs.readFileSync(__dirname + '/volume-up.svg', 'utf8');
export const volumeDown = fs.readFileSync(__dirname + '/volume-down.svg', 'utf8');
