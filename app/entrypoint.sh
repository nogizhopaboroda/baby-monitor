#!/bin/sh

echo "starting the thing"

mongroup -c config/mongroup.conf start
mongroup -c config/mongroup.conf logf
