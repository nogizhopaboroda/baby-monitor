ARG  BASE_IMAGE=baby-monitor:latest
FROM $BASE_IMAGE


RUN mkdir samples && curl -L https://github.com/131/h264-live-player/blob/master/samples/out.h264?raw=true -o samples/video.h264
RUN npm install stream-throttle

COPY scripts scripts
COPY services services
