raspivid --nopreview --width 960 --height 540 --framerate 20 --profile baseline --timeout 0 -o - | ./broadcaster.js
