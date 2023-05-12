FROM ubuntu:20.04

ARG TARGETPLATFORM

RUN apt-get update && \
    apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/UCT /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

RUN apt-get install -y wget g++ unzip zip nano python python3 cmake git libssl-dev libgmp-dev libtinfo5 libprotobuf-dev

RUN if [ "$TARGETPLATFORM" = "linux/amd64" ]; then BAZEL_BINARY=bazel-6.1.0-linux-x86_64; elif [ "$TARGETPLATFORM" = "linux/arm64" ]; then BAZEL_BINARY=bazel-6.1.0-linux-arm64; else BAZEL_BINARY=bazel-6.1.0-linux-x86_64; fi && \
    wget https://github.com/bazelbuild/bazel/releases/download/6.1.0/"$BAZEL_BINARY" && \
    chmod +x "$BAZEL_BINARY" && \
    mkdir -p /root/.bazel/bin && \
    mv "$BAZEL_BINARY" /root/.bazel/bin/bazel

RUN if [ "$TARGETPLATFORM" = "linux/amd64" ]; then DOCKER_ARCH=amd64; elif [ "$TARGETPLATFORM" = "linux/arm64" ]; then DOCKER_ARCH=arm64; else DOCKER_ARCH=amd64; fi && \
    apt-get -y install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    software-properties-common && \
    curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && \
    add-apt-repository \
      "deb [arch=$DOCKER_ARCH] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
      $(lsb_release -cs) \
      stable" && \
   apt-get update && \
   apt-get -y install docker-ce

RUN groupadd -f docker
RUN usermod -aG docker root

ENV PATH="$PATH:/root/.bazel/bin"
