FROM balenalib/raspberrypi3

RUN apt-get update && \
    apt-get -qy install \
        curl git alsa-utils

# install websocat
RUN sudo curl -L https://github.com/vi/websocat/releases/download/v2.0.0-alpha0/websocat_arm-linux-static -o /usr/local/bin/websocat
RUN chmod +x /usr/local/bin/websocat
