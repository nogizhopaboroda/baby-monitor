FROM balenalib/raspberrypi3-alpine-node

ENV WORKDIR /app

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python

COPY package.json yarn.lock ${WORKDIR}/
WORKDIR ${WORKDIR}
RUN yarn install --network-timeout 1000000

ADD src ${WORKDIR}/src

# RUN yarn build
# ENTRYPOINT ["yarn", "start"]
CMD yarn start -p ${HTTP_PORT}
