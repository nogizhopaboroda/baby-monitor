FROM balenalib/raspberrypi3-alpine-node as builder

ENV WORKDIR /app

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python

COPY client/package.json client/yarn.lock ${WORKDIR}/
WORKDIR ${WORKDIR}
RUN yarn install --network-timeout 1000000

ADD client ${WORKDIR}

RUN yarn build



FROM balenalib/raspberrypi3-alpine


ENV WORKDIR /app

ENV STREAMS_DIR /streams
ENV MAIN_VIDEO_STREAM video-stream-main.h264
ENV MAIN_AUDIO_STREAM audio-stream-main.raw

RUN apk update && apk add \
    git g++ gcc libgcc libstdc++ linux-headers make git \
    python py-pip python-dev \
    raspberrypi \
    alsa-utils ffmpeg \
    tmux htop


# TODO: change to /assets
COPY --from=builder /${WORKDIR}/dist /${WORKDIR}/dist


# install AdafruitDHT
RUN mkdir /tmp/dht && cd /tmp/dht && git clone https://github.com/adafruit/Adafruit_Python_DHT.git && cd Adafruit_Python_DHT && python setup.py install --force-pi && cd ../ && rm -rf Adafruit_Python_DHT

#install mon
RUN mkdir /tmp/mon && cd /tmp/mon && curl -L# https://github.com/tj/mon/archive/master.tar.gz | tar zx --strip 1 && make install && rm -rf /tmp/mon

#install mongroup
RUN mkdir /tmp/mongroup && cd /tmp/mongroup && curl -L# https://github.com/jgallen23/mongroup/archive/master.tar.gz | tar zx --strip 1 && make install && rm -rf /tmp/mongroup

#install fifo_broadcaster
RUN mkdir /tmp/fifo_broadcaster && cd /tmp/fifo_broadcaster && curl -L# https://github.com/nogizhopaboroda/fifo_broadcaster/releases/download/0.3/fifo_broadcaster_linux_arm.tar.gz | tar zx --strip 1 && mv fifo_broadcaster /usr/local/bin/ws-broadcaster && rm -rf /tmp/fifo_broadcaster

# install websocat
RUN curl -L https://github.com/vi/websocat/releases/download/v2.0.0-alpha0/websocat_arm-linux-static -o /usr/local/bin/websocat
RUN chmod +x /usr/local/bin/websocat

#install caddy server
RUN curl https://getcaddy.com | bash -s personal

#install gotty
RUN curl -L# https://github.com/yudai/gotty/releases/download/v2.0.0-alpha.3/gotty_2.0.0-alpha.3_linux_arm.tar.gz | tar zx --strip 1 -C /usr/local/bin/
RUN chmod +x /usr/local/bin/gotty


#create named pipes for streams
RUN mkdir $STREAMS_DIR && cd $STREAMS_DIR && \
    mkfifo $MAIN_VIDEO_STREAM $MAIN_AUDIO_STREAM


WORKDIR ${WORKDIR}
ADD app ${WORKDIR}

ENTRYPOINT ["./entrypoint.sh"]
