#!/bin/sh

BASE_IMAGE_TAG="baby-monitor-base:latest"

current_path=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
parent_directory_path=$(dirname "$current_path")

. $parent_directory_path/build.sh $BASE_IMAGE_TAG

docker build --build-arg BASE_IMAGE=baby-monitor-base:latest --tag baby-monitor-development:latest $@ $current_path
