FROM balenalib/raspberrypi3


SHELL ["/bin/bash", "-l", "-c"]

RUN apt-get update && \
    apt-get -qy install \
        curl git make alsa-utils \
        tmux

#install node
# RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
# RUN apt-get install -y nodejs

#install mongroup
RUN cd `mktemp -d` && curl -L# https://github.com/jgallen23/mongroup/archive/master.tar.gz | tar zx --strip 1 && make install

# install websocat
RUN sudo curl -L https://github.com/vi/websocat/releases/download/v2.0.0-alpha0/websocat_arm-linux-static -o /usr/local/bin/websocat
RUN chmod +x /usr/local/bin/websocat

#install caddy server
RUN curl https://getcaddy.com | bash -s personal

#install gotty
RUN curl -L# https://github.com/yudai/gotty/releases/download/v2.0.0-alpha.3/gotty_2.0.0-alpha.3_linux_arm.tar.gz | tar zx --strip 1 -C /usr/local/bin/
RUN chmod +x /usr/local/bin/gotty

#install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

ADD . /baby-monitor
WORKDIR /baby-monitor

RUN ls -la
RUN nvm -v
# RUN nvm install
