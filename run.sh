#!/bin/sh

docker run -it --env IS_EMULATION_MODE=true -p 5000:5000 baby-monitor:latest
