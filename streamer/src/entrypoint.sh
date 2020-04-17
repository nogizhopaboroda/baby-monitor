#!/bin/sh

echo "creating streams"

streams=(
    $VIDEO_RECORDING_PIPE
    $RAW_VIDEO_RECORDING_PIPE
    $AUDIO_RECORDING_PIPE
    $RAW_AUDIO_RECORDING_PIPE
    $RAW_AUDIO_RECORDING_PIPE_1
)

for stream in "${streams[@]}"; do
  stream_path=$PIPES_DIR/$stream
  echo "creating $stream_path"
  mkfifo $stream_path
done


echo "starting the monitor"

mongroup -c $WORKDIR/mongroup.conf start
mongroup -c $WORKDIR/mongroup.conf logf
