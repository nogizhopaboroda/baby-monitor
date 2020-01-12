# baby-monitor

## stream mic

```sh
arecord -c 1 -r 44100 -f S16_LE -D plughw:1,0 2>log.txt | websocat -b -s 192.168.1.90:8080
```

## stream camera

```sh
raspivid --nopreview --width 960 --height 540 --framerate 20 --profile baseline --timeout 0 -o - | ./scripts/converter.js | websocat --binary -s 192.168.1.90:8080
```
