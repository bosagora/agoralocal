#!/bin/bash

docker buildx build --platform=linux/amd64,linux/arm64 -t bosagora/boa-scan-builder:v1.14.4 -f Dockerfile --push .
