# FROM balenalib/raspberrypi3-alpine-node as builder

# ENV WORKDIR /app

# RUN apk --no-cache add --virtual native-deps \
  # g++ gcc libgcc libstdc++ linux-headers make python

# COPY client/package.json client/yarn.lock ${WORKDIR}/
# WORKDIR ${WORKDIR}
# RUN yarn install --network-timeout 1000000

# ADD client ${WORKDIR}

# RUN yarn build



FROM balenalib/raspberrypi3-alpine

# Set env variables

ENV WORKDIR /app

ENV PIPES_DIR /streams
ENV VIDEO_RECORDING_PIPE=video-stream-main.h264
ENV AUDIO_RECORDING_PIPE=audio-stream-main.raw
ENV RAW_VIDEO_RECORDING_PIPE=video-stream-main.yuv

## General
# ENV HTTP_PORT=8080
ENV WEBSHELL_PORT=5000

## Audio
ENV AUDIO_SAMPLE_RATE=16000
ENV AUDIO_FORMAT=S16_LE
ENV AUDIO_BUFFER_SIZE=8000
ENV AUDIO_CHANNELS=1
ENV AUDIO_FILE_TYPE=raw
ENV AUDIO_STREAMER_WS_PORT=8000
ENV AUDIO_STREAMER_TCP_PORT=2000

##Video
ENV VIDEO_HEIGHT=549
ENV VIDEO_WIDTH=960
ENV VIDEO_FRAMERATE=20
ENV VIDEO_BRIGHTNESS=60
ENV VIDEO_SATURATION=-100
ENV VIDEO_ROTATION=90
ENV VIDEO_STREAMER_WS_PORT=8001
ENV VIDEO_STREAMER_TCP_PORT=2001

##Video Raw
ENV RAW_VIDEO_STREAMER_WS_PORT=8002
ENV RAW_VIDEO_STREAMER_TCP_PORT=2002
ENV RAW_VIDEO_FORMAT=yuv

ENV TEMP_HUMIDITY_STREAMER_WS_PORT=8003
ENV TEMP_HUMIDITY_STREAMER_TCP_PORT=2003

RUN apk update && apk add \
    git g++ gcc libgcc libstdc++ linux-headers make git \
    python py-pip python-dev \
    raspberrypi \
    alsa-utils ffmpeg \
    tmux htop


# TODO: change to /assets
# ENV SITE_ROOT=/www
# COPY --from=builder /${WORKDIR}/dist ${SITE_ROOT}


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

#install caddy server
# RUN curl https://getcaddy.com | bash -s personal

#install gotty
RUN curl -L# https://github.com/yudai/gotty/releases/download/v2.0.0-alpha.3/gotty_2.0.0-alpha.3_linux_arm.tar.gz | tar zx --strip 1 -C /usr/local/bin/
RUN chmod +x /usr/local/bin/gotty


#create named pipes for streams
RUN mkdir -p $PIPES_DIR && cd $PIPES_DIR && \
    mkfifo $VIDEO_RECORDING_PIPE $RAW_VIDEO_RECORDING_PIPE $AUDIO_RECORDING_PIPE


WORKDIR ${WORKDIR}
ADD . ${WORKDIR}


RUN echo 'alias mg="mongroup -c config/mongroup.conf"' >> ~/.bashrc

ENTRYPOINT ["./entrypoint.sh"]
