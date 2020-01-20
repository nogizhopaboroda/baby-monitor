# baby-monitor

## stream mic

```sh
arecord -c 1 -r 44100 -f S16_LE -D plughw:1,0 2>log.txt | websocat -b -s 192.168.1.90:8080
```

## stream camera

```sh
raspivid --nopreview --width 960 --height 540 --framerate 20 --profile baseline --timeout 0 -o - | ./scripts/converter.js | websocat --binary -s 192.168.1.90:8080
```

```sh
#serv
raspivid --nopreview --width 960 --height 540 --framerate 20 --profile baseline --timeout 0 --inline -ih -o - | websocat --binary -s 192.168.1.90:8081


#broadcaster
websocat --exit-on-eof --binary ws-l:192.168.1.90:8080 cmd:"websocat --binary ws://192.168.1.90:8081 | node baby-monitor/scripts/converter"

```

## emulate video
```sh
ffmpeg -f lavfi -i testsrc=size=1280x720:rate=30 -f h264 output.h264 
```
