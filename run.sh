#!/bin/sh

#audio
ffmpeg -f avfoundation -i ":0" -f wav - | websocat --binary -s 0.0.0.0:8080

#video
ffmpeg -f avfoundation -i "0:" -f h264 - | websocat --binary -s 0.0.0.0:8080


HOST_IP=$(ipconfig getifaddr en0)
docker run -it --env EMULATE_STREAM_SERVICES=true --add-host="parenthost:$HOST_IP" -p 5000:5000 baby-monitor:latest
