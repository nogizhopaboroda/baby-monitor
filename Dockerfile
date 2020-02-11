FROM balenalib/raspberrypi3


ENV WORKDIR /baby-monitor
ENV STREAMS_DIR /streams
ENV MAIN_VIDEO_STREAM video-stream-main.h264


RUN apt-get update && \
    apt-get -qy install \
        curl git make build-essential \
        nodejs npm \
        python python-pip python-dev \
        alsa-utils ffmpeg \
        tmux htop

RUN sudo python -m pip install --upgrade pip setuptools wheel
RUN sudo pip install Adafruit_DHT


#install mon
RUN mkdir /tmp/mon && cd /tmp/mon && curl -L# https://github.com/tj/mon/archive/master.tar.gz | tar zx --strip 1 && make install && rm -rf /tmp/mon

#install mongroup
RUN mkdir /tmp/mongroup && cd /tmp/mongroup && curl -L# https://github.com/jgallen23/mongroup/archive/master.tar.gz | tar zx --strip 1 && make install && rm -rf /tmp/mongroup

# install websocat
RUN sudo curl -L https://github.com/vi/websocat/releases/download/v2.0.0-alpha0/websocat_arm-linux-static -o /usr/local/bin/websocat
RUN chmod +x /usr/local/bin/websocat

#install caddy server
RUN curl https://getcaddy.com | bash -s personal

#install gotty
RUN curl -L# https://github.com/yudai/gotty/releases/download/v2.0.0-alpha.3/gotty_2.0.0-alpha.3_linux_arm.tar.gz | tar zx --strip 1 -C /usr/local/bin/
RUN chmod +x /usr/local/bin/gotty


#create named pipes for streams
RUN mkdir $STREAMS_DIR && cd $STREAMS_DIR && \
    mkfifo $MAIN_VIDEO_STREAM video-stream-web.h264 video-stream-1.h264 \
           audio-stream-main.wav  audio-stream-web.wav  audio-stream-1.wav


ADD package.json package-lock.json ${WORKDIR}/
WORKDIR ${WORKDIR}
RUN npm install


ADD . ${WORKDIR}

RUN npm run build

ENTRYPOINT ["./entrypoint.sh"]
