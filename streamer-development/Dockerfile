ARG  BASE_IMAGE=baby-monitor:latest
FROM $BASE_IMAGE


# install AdafruitDHT
RUN mkdir /tmp/dht && cd /tmp/dht && git clone https://github.com/adafruit/Adafruit_Python_DHT.git && cd Adafruit_Python_DHT && python setup.py install --force-pi && cd ../ && rm -rf /tmp/dht

COPY src/services services
