const {spawn} = require('child_process');

const createMicrophoneStream = (options = {}) => {
  const {
    format = 'dat',
  } = options;
  const ps = spawn('arecord', ['-D', 'plughw:1,0', '-f', format]);

  return ps;
};

module.exports = createMicrophoneStream;
