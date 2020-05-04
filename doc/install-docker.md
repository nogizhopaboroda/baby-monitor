[from](https://dev.to/rohansawant/installing-docker-and-docker-compose-on-the-raspberry-pi-in-5-simple-steps-3mgl)

1. Install Docker
```sh
curl -sSL https://get.docker.com | sh
```

2. Add permission to Pi User to run Docker Commands
```sh
sudo usermod -aG docker pi
```

3. Install proper dependencies

```sh
sudo apt-get install libffi-dev libssl-dev

sudo apt-get install -y python python-pip

sudo apt-get remove python-configparser
```

4. Install Docker Compose
```sh
sudo pip install docker-compose
```
