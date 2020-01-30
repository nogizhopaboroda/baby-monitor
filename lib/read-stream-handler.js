const fs = require('fs');

const noop = () => {};

const createReadableStreamHandler = (options) => {
  const { source, onData = noop, onOpen = noop, onClose = noop } = options;
  const readStream = fs.createReadStream(source);
  onOpen(readStream);

  readStream.on('data', onData);

  readStream.on('end', () => {
    onClose(readStream);
    readStream.destroy();
    createReadableStreamHandler(options);
  });
};

module.exports = createReadableStreamHandler;
