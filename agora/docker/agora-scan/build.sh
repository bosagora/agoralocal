#!/bin/bash

CURRENT_POS="$(pwd)"
cd ../../../../agora-scan
TAG_NANE="$(git rev-parse --abbrev-ref HEAD)-$(git rev-parse --short=6 HEAD)"
echo "TAG_NANE=$TAG_NANE"
cd "$CURRENT_POS"
docker buildx build --platform=linux/amd64,linux/arm64 -t bosagora/agora-scan:"$TAG_NANE" -f Dockerfile --push ../../../../agora-scan
