const fs = require('fs');

const noop = () => {};

const createReadStreamHandler = (options) => {
  const { source, onData = noop, onOpen = noop, onClose = noop } = options;
  const readStream = fs.createReadStream(source);
  onOpen(readStream);

  readStream.on('data', onData);

  readStream.on('end', () => {
    onClose(readStream);
    readStream.destroy();
    createReadStreamHandler(options);
  });
};

module.exports = createReadStreamHandler;
