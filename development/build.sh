#!/bin/sh

BASE_IMAGE_TAG="baby-monitor-base:latest"

current_path=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
parent_directory_path=$(dirname "$current_path")

. $parent_directory_path/build.sh $BASE_IMAGE_TAG

command="docker build $@ --build-arg BASE_IMAGE=$BASE_IMAGE_TAG --tag baby-monitor-development:latest $current_path"

exec $command
