#!/bin/bash

CURRENT_POS="$(pwd)"
cd ../../../../boa-scan
TAG_NANE="$(git rev-parse --abbrev-ref HEAD)-$(git rev-parse --short=6 HEAD)-amd64"
echo "TAG_NANE=$TAG_NANE"
cd "$CURRENT_POS"
docker build -f Dockerfile --build-arg RELEASE_VERSION="5.1.4" -t bosagora/boa-scan:"$TAG_NANE" ../../../../boa-scan
docker build -f Dockerfile --build-arg RELEASE_VERSION="5.1.4" -t bosagora/boa-scan:agora-amd64 ../../../../boa-scan
docker push bosagora/boa-scan:"$TAG_NANE"
docker push bosagora/boa-scan:agora-amd64
