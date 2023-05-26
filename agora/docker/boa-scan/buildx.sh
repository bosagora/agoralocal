#!/bin/bash

CURRENT_POS="$(pwd)"
cd ../../../../boa-scan
TAG_NANE="$(git rev-parse --abbrev-ref HEAD)-$(git rev-parse --short=6 HEAD)"
echo "TAG_NANE=$TAG_NANE"
cd "$CURRENT_POS"

docker buildx build --platform=linux/amd64,linux/arm64 --build-arg RELEASE_VERSION="5.1.4" -f Dockerfile -t bosagora/boa-scan:"$TAG_NANE" --push ../../../../boa-scan
docker buildx build --platform=linux/amd64,linux/arm64 --build-arg RELEASE_VERSION="5.1.4" -f Dockerfile -t bosagora/boa-scan:latest --push ../../../../boa-scan

