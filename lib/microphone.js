const {spawn} = require('child_process');

const createMicrophoneStream = (options = {}) => {
  const {
    format = 'S16_LE',
    bufferSize = 128 * 1024,
    rate = 44100, // 44100Hz sample rate
    bitWidth = 16, // 2 channels
    channels = 2,
  } = options;

  const ps = spawn('arecord', [
    '-D', 'plughw:1,0',
    '-f', format,
    '-c', '2',
    '-r', rate,
    '--buffer-size=' + bufferSize,
    // '-b', bitWidth,
  ]);

  return ps;
};

module.exports = createMicrophoneStream;
