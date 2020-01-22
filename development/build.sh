#!/bin/sh

current_path=$( dirname "${BASH_SOURCE[0]}" )

docker build --tag baby-monitor-development:latest $current_path
