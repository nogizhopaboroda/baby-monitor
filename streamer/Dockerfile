FROM arm32v7/alpine

# Set env variables

ENV WORKDIR /app

ENV PIPES_DIR /streams

ENV VIDEO_RECORDING_PIPE=video-stream-main.h264
ENV AUDIO_RECORDING_PIPE=audio-stream-main.aac

ENV RAW_VIDEO_RECORDING_PIPE=video-stream-main.yuv
ENV RAW_AUDIO_RECORDING_PIPE=audio-stream-main.raw
ENV RAW_AUDIO_RECORDING_PIPE_1=audio-stream-1.raw


## General
ENV WEBSHELL_PORT=5000
ENV TERM=xterm-256color

## Audio
ENV AUDIO_SAMPLE_RATE=44100
ENV AUDIO_BUFFER_SIZE=8000
ENV AUDIO_CHANNELS=1
ENV AUDIO_GAIN=30

ENV AUDIO_STREAMER_WS_PORT=8000
ENV AUDIO_STREAMER_TCP_PORT=2000

##Audio Raw
ENV RAW_AUDIO_FORMAT=s16_le
ENV RAW_AUDIO_SAMPLE_RATE=8000
ENV RAW_AUDIO_STREAMER_WS_PORT=8001
ENV RAW_AUDIO_STREAMER_TCP_PORT=2001

ENV ECASOUND_FILTERS="-efl:2000 -efh:500"
ENV AUDIODEV=alsahw,1,0
ENV MICROPHONE_SAMPLE_RATE=44100
ENV MICROPHONE_CHANNELS=1

##Video
ENV VIDEO_HEIGHT=480
ENV VIDEO_WIDTH=640
ENV VIDEO_FRAMERATE=20
ENV VIDEO_BRIGHTNESS=60
ENV VIDEO_SATURATION=-100
ENV VIDEO_ROTATION=90
ENV VIDEO_STREAMER_WS_PORT=9000
ENV VIDEO_STREAMER_TCP_PORT=3000

##Video Raw
ENV RAW_VIDEO_STREAMER_WS_PORT=9001
ENV RAW_VIDEO_STREAMER_TCP_PORT=3001
ENV RAW_VIDEO_FORMAT=yuv

ENV TEMP_HUMIDITY_STREAMER_WS_PORT=7000
ENV TEMP_HUMIDITY_STREAMER_TCP_PORT=1000

RUN apk update && apk add \
    git g++ gcc libgcc libstdc++ linux-headers make curl \
    python2 py-pip python2-dev py2-setuptools \
    raspberrypi \
    alsa-utils faac ffmpeg \
    tmux htop

RUN apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing ecasound


# install AdafruitDHT
RUN mkdir /tmp/dht && cd /tmp/dht && git clone https://github.com/adafruit/Adafruit_Python_DHT.git && cd Adafruit_Python_DHT && python setup.py install && cd ../ && rm -rf /tmp/dht

#install mon
RUN mkdir /tmp/mon && cd /tmp/mon && curl -L# https://github.com/tj/mon/archive/master.tar.gz | tar zx --strip 1 && make install && rm -rf /tmp/mon

#install mongroup
RUN mkdir /tmp/mongroup && cd /tmp/mongroup && curl -L# https://github.com/jgallen23/mongroup/archive/master.tar.gz | tar zx --strip 1 && make install && rm -rf /tmp/mongroup

#install fifo_broadcaster
RUN mkdir /tmp/fifo_broadcaster && cd /tmp/fifo_broadcaster && curl -L# https://github.com/nogizhopaboroda/fifo_broadcaster/releases/download/0.4/fifo_broadcaster_linux_arm.tar.gz | tar zx --strip 1 && mv fifo_broadcaster /usr/local/bin/fifo-broadcaster && rm -rf /tmp/fifo_broadcaster

# install websocat
RUN curl -L https://github.com/vi/websocat/releases/download/v2.0.0-alpha0/websocat_arm-linux-static -o /usr/local/bin/websocat
RUN chmod +x /usr/local/bin/websocat

#install gotty
RUN curl -L# https://github.com/yudai/gotty/releases/download/v2.0.0-alpha.3/gotty_2.0.0-alpha.3_linux_arm.tar.gz | tar zx --strip 1 -C /usr/local/bin/
RUN chmod +x /usr/local/bin/gotty

#create named pipes directory
RUN mkdir -p $PIPES_DIR


WORKDIR ${WORKDIR}
ADD src ${WORKDIR}


ENTRYPOINT ["./entrypoint.sh"]
