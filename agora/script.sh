#!/bin/bash

set -eu

function color() {
    # Usage: color "31;5" "string"
    # Some valid values for color:
    # - 5 blink, 1 strong, 4 underlined
    # - fg: 31 red,  32 green, 33 yellow, 34 blue, 35 purple, 36 cyan, 37 white
    # - bg: 40 black, 41 red, 44 blue, 45 purple
    printf '\033[%sm%s\033[0m\n' "$@"
}

if [ "$#" -lt 1 ]; then
    color "31" "Usage: ./agora.sh PROCESS FLAGS."
    color "31" "PROCESS can be init"
    exit 1
fi

dirname=${PWD##*/}
agora_root="$(pwd)/agora"
if [ $dirname = "agora" ]; then
  agora_root="$(pwd)"
fi

if [ "$1" = "init" ]; then

    npx ts-node "$agora_root"/adjustment/createForkData.ts
    npx ts-node "$agora_root"/adjustment/replaceGenesisTimeStamp.ts "$agora_root"/config/cl/chain-config-template.yaml "$agora_root"/config/cl/chain-config.yaml
    npx ts-node "$agora_root"/adjustment/replaceGenesisTimeStamp.ts "$agora_root"/config/cl/chain-config-template-capella.yaml "$agora_root"/config/cl/chain-config-capella.yaml
    npx ts-node "$agora_root"/adjustment/replaceGenesisTimeStamp.ts "$agora_root"/config/el/genesis-template-shanghai.json "$agora_root"/config/el/genesis-shanghai.json
    npx ts-node "$agora_root"/adjustment/replaceGenesisTimeStamp.ts "$agora_root"/config/el/genesis-template.json "$agora_root"/config/el/genesis.json
    npx ts-node "$agora_root"/adjustment/replaceGenesisTimeStamp.ts "$agora_root"/config/scan/default.config-template.yml "$agora_root"/config/scan/default.config.yml

    rm -rf "$agora_root"/chain
    mkdir -p "$agora_root"/chain

    mkdir -p "$agora_root"/chain/node1
    mkdir -p "$agora_root"/chain/node1/el
    mkdir -p "$agora_root"/chain/node1/cl

    mkdir -p "$agora_root"/chain/node2
    mkdir -p "$agora_root"/chain/node2/el
    mkdir -p "$agora_root"/chain/node2/cl

    mkdir -p "$agora_root"/chain/node3
    mkdir -p "$agora_root"/chain/node3/el
    mkdir -p "$agora_root"/chain/node3/cl

    mkdir -p "$agora_root"/chain/node4
    mkdir -p "$agora_root"/chain/node4/el
    mkdir -p "$agora_root"/chain/node4/cl

    mkdir -p "$agora_root"/chain/node5
    mkdir -p "$agora_root"/chain/node5/el
    mkdir -p "$agora_root"/chain/node5/cl

    cp -rf "$agora_root"/config/el/template/node1/* "$agora_root"/chain/node1/el
    cp -rf "$agora_root"/config/el/template/node2/* "$agora_root"/chain/node2/el
    cp -rf "$agora_root"/config/el/template/node3/* "$agora_root"/chain/node3/el
    cp -rf "$agora_root"/config/el/template/node4/* "$agora_root"/chain/node4/el

    docker run -it -v "$agora_root"/chain/node1/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis.json
    docker run -it -v "$agora_root"/chain/node2/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis.json
    docker run -it -v "$agora_root"/chain/node3/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis.json
    docker run -it -v "$agora_root"/chain/node4/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis.json
    docker run -it -v "$agora_root"/chain/node5/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis.json

    cp -f "$agora_root"/config/el/nodekey/node1.key "$agora_root"/chain/node1/el/geth/nodekey
    cp -f "$agora_root"/config/el/nodekey/node2.key "$agora_root"/chain/node2/el/geth/nodekey
    cp -f "$agora_root"/config/el/nodekey/node3.key "$agora_root"/chain/node3/el/geth/nodekey
    cp -f "$agora_root"/config/el/nodekey/node4.key "$agora_root"/chain/node4/el/geth/nodekey

elif [ "$1" = "start" ]; then

    docker-compose -f "$agora_root"/nodes/docker-compose.yml up -d

elif [ "$1" = "stop" ]; then

    docker-compose -f "$agora_root"/nodes/docker-compose.yml down

    if [ -f "$agora_root/nodes-simulation/docker-compose.yml" ]; then
        docker-compose -f "$agora_root"/nodes-simulation/docker-compose.yml down
    fi

elif [ "$1" = "attach" ]; then

    docker run -it -v "$agora_root"/chain/node1/el:/data -v "$agora_root"/config/el:/config --name el-node-attach --rm bosagora/agora-el-node:v1.0.2 --datadir=/data attach /data/geth.ipc

elif [ "$1" = "import" ]; then

    docker run -it \
    -v "$agora_root"/config/cl:/config \
    -v "$agora_root"/wallet:/wallet \
    --name cl-validator --rm \
    bosagora/agora-cl-validator:v1.0.3 \
    accounts import \
    --accept-terms-of-use \
    --chain-config-file=/config/chain-config.yaml \
    --keys-dir=/wallet/key$2 \
    --wallet-dir=/wallet/val$2

elif [ "$1" = "start-db" ]; then

    docker-compose -f "$agora_root"/postgres/docker-compose.yml up -d

elif [ "$1" = "stop-db" ]; then

    docker-compose -f "$agora_root"/postgres/docker-compose.yml down

elif [ "$1" = "init-db" ]; then

    chmod 0600 "$agora_root"/postgres/.pgpass
    docker run -it --rm --net=host -v "$agora_root"/config/scan:/src -v "$agora_root"/postgres/.pgpass:/root/.pgpass postgres:12.0 psql -f /src/tables.sql -d db -h 0.0.0.0 -U agora

elif [ "$1" = "start-agora-scan" ]; then

    docker-compose -f "$agora_root"/agora-scan/docker-compose.yml up -d

elif [ "$1" = "stop-agora-scan" ]; then

    docker-compose -f "$agora_root"/agora-scan/docker-compose.yml down

else

    color "31" "Process '$1' is not found!"
    color "31" "Usage: ./agora.sh PROCESS FLAGS."
    color "31" "PROCESS can be init"
    exit 1

fi
