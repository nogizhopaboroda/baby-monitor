#!/bin/sh
TAG=${1:-baby-monitor:latest}

docker build -f Dockerfile.alpine --tag $TAG .
