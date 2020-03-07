ARG  BASE_IMAGE=baby-monitor:latest
FROM $BASE_IMAGE


COPY services services
