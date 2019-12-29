//taken from https://github.com/cwilso/volume-meter

/*
Usage:
audioNode = createAudioMeter(audioContext,clipLevel,averaging,clipLag);
audioContext: the AudioContext you're using.
clipLevel: the level (0 to 1) that you would consider "clipping".
   Defaults to 0.98.
averaging: how "smoothed" you would like the meter to be over time.
   Should be between 0 and less than 1.  Defaults to 0.95.
clipLag: how long you would like the "clipping" indicator to show
   after clipping has occured, in milliseconds.  Defaults to 750ms.
Access the clipping through node.checkClipping(); use node.shutdown to get rid of it.
*/

function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
  var processor = audioContext.createScriptProcessor(512);
  processor.onaudioprocess = volumeAudioProcess;
  processor.clipping = false;
  processor.lastClip = 0;
  processor.volume = 0;
  processor.clipLevel = clipLevel || 0.98;
  processor.averaging = averaging || 0.95;
  processor.clipLag = clipLag || 750;

  // this will have no effect, since we don't copy the input to the output,
  // but works around a current Chrome bug.
  processor.connect(audioContext.destination);

  processor.checkClipping = function() {
    if (!this.clipping) return false;
    if (this.lastClip + this.clipLag < window.performance.now())
      this.clipping = false;
    return this.clipping;
  };

  processor.shutdown = function() {
    this.disconnect();
    this.onaudioprocess = null;
  };

  return processor;
}

function volumeAudioProcess(event) {
  var buf = event.inputBuffer.getChannelData(0);
  var bufLength = buf.length;
  var sum = 0;
  var x;

  // Do a root-mean-square on the samples: sum up the squares...
  for (var i = 0; i < bufLength; i++) {
    x = buf[i];
    if (Math.abs(x) >= this.clipLevel) {
      this.clipping = true;
      this.lastClip = window.performance.now();
    }
    sum += x * x;
  }

  // ... then take the square root of the sum.
  var rms = Math.sqrt(sum / bufLength);

  // Now smooth this out with the averaging factor applied
  // to the previous sample - take the max here because we
  // want "fast attack, slow release."
  this.volume = Math.max(rms, this.volume * this.averaging);
}

const createVisualiser = (stream, audioContext) => {
  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');

  canvas.height = 50;

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  let rafID = null;

  // Create a new volume meter and connect it.
  const meter = createAudioMeter(audioContext);
  stream.connect(meter);

  // kick off the visual updating
  onLevelChange();

  function onLevelChange(time) {
    // clear the background
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

    // check if we're currently clipping
    if (meter.checkClipping()) canvasContext.fillStyle = 'red';
    else canvasContext.fillStyle = 'green';

    console.log(meter.volume);

    // draw a bar based on the current volume
    canvasContext.fillRect(0, 0, meter.volume * WIDTH * 1.4, HEIGHT);

    // set up the next visual callback
    rafID = window.requestAnimationFrame(onLevelChange);
  }

  return canvas;
};

export default createVisualiser;
