FROM balenalib/raspberrypi3

RUN apt-get update && \
    apt-get -qy install \
        curl git make build-essential \
        nodejs npm \
        python python-pip \
        alsa-utils ffmpeg \
        tmux


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
RUN mkdir /streams && cd /streams && \
    mkfifo video-stream-main.h264 video-stream-web.h264 video-stream-1.h264 \
           audio-stream-main.wav  audio-stream-web.wav  audio-stream-1.wav


ADD . /baby-monitor
WORKDIR /baby-monitor

RUN npm install
RUN npm run build

ENTRYPOINT ["./entrypoint.sh"]
