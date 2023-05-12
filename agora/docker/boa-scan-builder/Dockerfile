FROM elixir:1.14.4 AS builder

# 빌드 환경 구성
RUN apt-get update
RUN apt-get install -y wget build-essential keychain git python curl

# NVM_DIR, NODE_VERSION에 따른 ENV 설정
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 16.20.0

# NVM 다운로드 & 설치
RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

SHELL ["/bin/bash", "-c"]
# nvm 구성 & node install
RUN source $NVM_DIR/nvm.sh; \
    nvm install $NODE_VERSION; \
    nvm use --delete-prefix $NODE_VERSION;

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
ARG CACHE_EXCHANGE_RATES_PERIOD
ARG DISABLE_READ_API="FASE"
ARG DISABLE_WEBAPP="FALSE"
ARG DISABLE_WRITE_API="FALSE"
ARG CACHE_TOTAL_GAS_USAGE_COUNTER_ENABLED=""
ARG ADMIN_PANEL_ENABLED=""
ARG CACHE_ADDRESS_WITH_BALANCES_UPDATE_INTERVAL=""
ARG SESSION_COOKIE_DOMAIN
ARG MIXPANEL_TOKEN
ARG MIXPANEL_URL
ARG AMPLITUDE_API_KEY
ARG AMPLITUDE_URL
ARG RELEASE_VERSION=5.1.4
