#!/bin/bash

apt-get update -yqq
apt-get install -y --no-install-recommends nodejs
rm -rf /var/lib/apt/lists/*

cd "$CI_PROJECT_DIR"/product-docs || exit
bundle install
