#!/bin/bash

docker buildx build --platform=linux/amd64,linux/arm64 -t bosagora/agora-cl-builder:v6.1.0 -f Dockerfile --push .
