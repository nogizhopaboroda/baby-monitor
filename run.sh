#!/bin/sh

docker run -it --privileged -v /dev/snd/:/dev/snd/ -v /opt/vc/lib:/opt/vc/lib --device /dev/vchiq:/dev/vchiq -p 5000:5000 -p 8000:8000 -p 8001:8001 baby-monitor:latest
