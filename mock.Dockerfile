ARG  BASE_IMAGE=baby-monitor:latest
FROM $BASE_IMAGE


COPY app-mock/services services

EXPOSE 5000
