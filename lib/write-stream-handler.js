const fs = require('fs');

const noop = () => {};

const createWriteStreamHandler = (options) => {
  const { target, onOpen = noop, onClose = noop } = options;

  const writeStream = fs.createWriteStream(target);
  onOpen(writeStream);

  writeStream.on('error', (e) => {
    onClose(writeStream);
    writeStream.destroy();
    createWriteStreamHandler(options);
  });
};

module.exports = createWriteStreamHandler;
