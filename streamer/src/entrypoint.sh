#!/bin/sh

echo "creating stream named pipes"
mkfifo $PIPES_DIR/{$VIDEO_RECORDING_PIPE,$RAW_VIDEO_RECORDING_PIPE,$AUDIO_RECORDING_PIPE,$RAW_AUDIO_RECORDING_PIPE,$RAW_AUDIO_RECORDING_PIPE_1}


echo "starting the monitor"

mongroup -c $WORKDIR/mongroup.conf start
mongroup -c $WORKDIR/mongroup.conf logf
