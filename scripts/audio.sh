#!/bin/bash

arecord -c 1 -r 44100 -f S16_LE -D plughw:1,0 | ./broadcaster.js
