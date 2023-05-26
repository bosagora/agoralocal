#!/bin/bash

CURRENT_POS="$(pwd)"
cd ../../../../boa-scan
TAG_NANE="$(git rev-parse --abbrev-ref HEAD)-$(git rev-parse --short=6 HEAD)-arm64"
echo "TAG_NANE=$TAG_NANE"
cd "$CURRENT_POS"
docker build -f Dockerfile --build-arg RELEASE_VERSION="5.1.4" -t bosagora/boa-scan:"$TAG_NANE" ../../../../boa-scan
