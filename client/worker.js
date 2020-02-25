let k = 0;
let lastBytes = [0,0,0,1];
let ttt = lastBytes.slice(0);
// onconnect = function(e) {
  // var port = e.ports[0];

  // port.onmessage = function(e) {
    // var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    // port.postMessage(workerResult);
  // }

// }
onmessage = function(e) {
  const data = e.data;
  // console.log('got data');
  for(let i = 0; i < data.length; i++){
    const fff = data[i];
    ttt.push(fff);
    lastBytes = [lastBytes[1], lastBytes[2], lastBytes[3], fff];
    // console.log(lastBytes);
    if(lastBytes[0] === 0 && lastBytes[1] === 0 && lastBytes[2] === 0 && lastBytes[3] === 1){
      const chunk = ttt.slice(0, ttt.length - 4);
      // console.log('got chunk');
      postMessage(new Uint8Array(chunk));
      ttt = lastBytes.slice(0);
      // debugger;
    }
  }
  // var workerResult = 'Result: ' + (e.data);
  // console.log('Posting message back to main script');
  // postMessage(workerResult);
}
