#!/bin/bash

docker buildx build --platform=linux/amd64,linux/arm64 -t bosagora/agora-scan:agora-v1.0.0 -f Dockerfile --push ../../../../agora-scan
