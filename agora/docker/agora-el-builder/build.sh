#!/bin/bash

CURRENT_POS="$(pwd)"
cd ../../../../agora-el

TAG_NANE="$(git rev-parse --abbrev-ref HEAD)-$(git rev-parse --short=6 HEAD)"
echo "TAG_NANE=$TAG_NANE"

docker buildx build --platform=linux/amd64,linux/arm64 -t bosagora/agora-el-node:"$TAG_NANE" -f Dockerfile --push .
docker buildx build --platform=linux/amd64,linux/arm64 -t bosagora/agora-el-bootnode:"$TAG_NANE" -f Dockerfile.bootnode --push .

cd "$CURRENT_POS"
