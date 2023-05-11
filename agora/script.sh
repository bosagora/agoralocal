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

system=""
case "$OSTYPE" in
darwin*) system="darwin" ;;
linux*) system="linux" ;;
msys*) system="windows" ;;
cygwin*) system="windows" ;;
*) exit 1 ;;
esac
readonly system

dirname=${PWD##*/}
agora_root="$(pwd)/agora"
if [ $dirname = "agora" ]; then
  agora_root="$(pwd)"
fi

if [ "$1" = "init" ]; then

    npx ts-node "$agora_root"/adjustment/createForkData.ts
    npx ts-node "$agora_root"/adjustment/replaceGenesisTimeStamp.ts "$agora_root"/config/cl/chain-config-template-bellatrix.yaml "$agora_root"/config/cl/chain-config-bellatrix.yaml
    npx ts-node "$agora_root"/adjustment/replaceGenesisTimeStamp.ts "$agora_root"/config/cl/chain-config-template-capella.yaml "$agora_root"/config/cl/chain-config-capella.yaml
    npx ts-node "$agora_root"/adjustment/replaceGenesisTimeStamp.ts "$agora_root"/config/el/genesis-template-shanghai.json "$agora_root"/config/el/genesis-shanghai.json
    npx ts-node "$agora_root"/adjustment/replaceGenesisTimeStamp.ts "$agora_root"/config/el/genesis-template-merge.json "$agora_root"/config/el/genesis-merge.json
    npx ts-node "$agora_root"/adjustment/replaceGenesisTimeStamp.ts "$agora_root"/config/scan/default.config-template.yml "$agora_root"/config/scan/default.config.yml

    if [ "$system" == "linux" ]; then
        sudo rm -rf "$agora_root"/chain
    else
        rm -rf "$agora_root"/chain
    fi

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

    mkdir -p "$agora_root"/chain/node6
    mkdir -p "$agora_root"/chain/node6/el
    mkdir -p "$agora_root"/chain/node6/cl

    cp -rf "$agora_root"/config/el/template/node1/* "$agora_root"/chain/node1/el
    cp -rf "$agora_root"/config/el/template/node2/* "$agora_root"/chain/node2/el
    cp -rf "$agora_root"/config/el/template/node3/* "$agora_root"/chain/node3/el
    cp -rf "$agora_root"/config/el/template/node4/* "$agora_root"/chain/node4/el
    cp -rf "$agora_root"/config/el/template/node5/* "$agora_root"/chain/node5/el

    docker run -it -v "$agora_root"/chain/node1/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis-merge.json
    docker run -it -v "$agora_root"/chain/node2/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis-merge.json
    docker run -it -v "$agora_root"/chain/node3/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis-merge.json
    docker run -it -v "$agora_root"/chain/node4/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis-merge.json
    docker run -it -v "$agora_root"/chain/node5/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis-merge.json
    docker run -it -v "$agora_root"/chain/node6/el:/data -v "$agora_root"/config/el:/config --name el-node --rm bosagora/agora-el-node:v1.0.2 --datadir=/data init /config/genesis-merge.json

    cp -f "$agora_root"/config/el/nodekey/node1.key "$agora_root"/chain/node1/el/geth/nodekey
    cp -f "$agora_root"/config/el/nodekey/node2.key "$agora_root"/chain/node2/el/geth/nodekey
    cp -f "$agora_root"/config/el/nodekey/node3.key "$agora_root"/chain/node3/el/geth/nodekey
    cp -f "$agora_root"/config/el/nodekey/node4.key "$agora_root"/chain/node4/el/geth/nodekey
    cp -f "$agora_root"/config/el/nodekey/node5.key "$agora_root"/chain/node5/el/geth/nodekey

elif [ "$1" = "start" ]; then

    docker-compose -f "$agora_root"/nodes-bellatrix/docker-compose.yml up -d

elif [ "$1" = "stop" ]; then

    docker-compose -f "$agora_root"/nodes-bellatrix/docker-compose.yml down

    if [ -f "$agora_root/nodes-capella/docker-compose.yml" ]; then
        docker-compose -f "$agora_root"/nodes-capella/docker-compose.yml down
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
    --chain-config-file=/config/chain-config-bellatrix.yaml \
    --keys-dir=/wallet/key"$2" \
    --wallet-dir=/wallet/val"$2"

elif [ "$1" = "start-db" ]; then

    docker-compose -f "$agora_root"/postgres/docker-compose.yml up -d

elif [ "$1" = "stop-db" ]; then

    docker-compose -f "$agora_root"/postgres/docker-compose.yml down

elif [ "$1" = "init-db" ]; then

    chmod 0600 "$agora_root"/postgres/.pgpass
    docker run -it --rm --net=host -v "$agora_root"/config/scan:/src -v "$agora_root"/postgres/.pgpass:/root/.pgpass postgres:12.0 psql -f /src/tables.sql -d db -h 0.0.0.0 -U agora > /dev/null

elif [ "$1" = "start-agora-scan" ]; then

    docker-compose -f "$agora_root"/agora-scan/docker-compose.yml up -d

elif [ "$1" = "stop-agora-scan" ]; then

    docker-compose -f "$agora_root"/agora-scan/docker-compose.yml down

elif [ "$1" = "validator-info" ]; then

    npx ts-node scripts/tools/getValidatorInfo.ts "$2"

elif [ "$1" = "all-validators-info" ]; then

    npx ts-node scripts/tools/getAllValidatorsInfo.ts

elif [ "$1" = "bls-change-35-37" ]; then

    if [ "$system" == "linux" ]; then
        sudo rm -rf "$agora_root"/wallet/bls_change/35
    else
        rm -rf "$agora_root"/wallet/bls_change/35
    fi
    mkdir -p "$agora_root"/wallet/bls_change/35

    echo "Mnemonic : board fire prize defy limb arm diet fee usage settle rigid sunny duty squirrel cheap history session same tilt candy loan culture pretty anchor"

    docker run -it --rm \
      -v "$agora_root"/wallet/bls_change/35:/withdrawal \
      bosagora/agora-deposit-cli:v2.5.0 \
      --language=english \
      --non_interactive \
      generate-bls-to-execution-change \
      --chain=devnet \
      --validator_start_index=35 \
      --validator_indices=35,36,37 \
      --bls_withdrawal_credentials_list=000e6e8f86eea4f677972cc1a80f6df3d2472e984eb5bdb14642669ff85fcfa0,0053b18e00df72bb97d022b29894b874fb65998ec0918605aeac735370e9f0bf,00eb2cd558d8b60469e5447e0953277d2f2f1dbdfca44fb0a86677165577a64e \
      --execution_address=0x9D2336FDFB431C8759f14a788D250a3b3577256e \
      --bls_to_execution_changes_folder=/withdrawal

elif [ "$1" = "bls-change-38" ]; then

    if [ "$system" == "linux" ]; then
        sudo rm -rf "$agora_root"/wallet/bls_change/38
    else
        rm -rf "$agora_root"/wallet/bls_change/38
    fi
    mkdir -p "$agora_root"/wallet/bls_change/38

    echo "Mnemonic : board fire prize defy limb arm diet fee usage settle rigid sunny duty squirrel cheap history session same tilt candy loan culture pretty anchor"

    docker run -it --rm \
      -v "$agora_root"/wallet/bls_change/38:/withdrawal \
      bosagora/agora-deposit-cli:v2.5.0 \
      --language=english \
      --non_interactive \
      generate-bls-to-execution-change \
      --chain=devnet \
      --validator_start_index=38 \
      --validator_indices=38 \
      --bls_withdrawal_credentials_list=00f50deb9ed081cc5dae40c3a1887fe1f772d37b39c649c7074983f26fb9db19 \
      --execution_address=0xBD598a0188c226427AE493bFc136DB0eaf90B341 \
      --bls_to_execution_changes_folder=/withdrawal

elif [ "$1" = "bls-change-39" ]; then

    if [ "$system" == "linux" ]; then
        sudo rm -rf "$agora_root"/wallet/bls_change/39
    else
        rm -rf "$agora_root"/wallet/bls_change/39
    fi
    mkdir -p "$agora_root"/wallet/bls_change/39

    echo "Mnemonic : board fire prize defy limb arm diet fee usage settle rigid sunny duty squirrel cheap history session same tilt candy loan culture pretty anchor"

    docker run -it --rm \
      -v "$agora_root"/wallet/bls_change/39:/withdrawal \
      bosagora/agora-deposit-cli:v2.5.0 \
      --language=english \
      --non_interactive \
      generate-bls-to-execution-change \
      --chain=devnet \
      --validator_start_index=39 \
      --validator_indices=39 \
      --bls_withdrawal_credentials_list=0072b98f706baf445239abb7b3cbf7a070f9bf34cf016a2c093a9034f364045d \
      --execution_address=0x45797f91B8258F60042004856EF25c453D5e062d \
      --bls_to_execution_changes_folder=/withdrawal

elif [ "$1" = "validator-withdraw-35-37" ]; then

    docker run -it --rm \
      -v "$agora_root"/config/cl:/config \
      -v "$agora_root"/wallet/bls_change/35:/withdrawal \
      bosagora/agora-cl-ctl:agora_v4.0.3-6613b3 \
      validator withdraw \
      --chain-config-file=/config/chain-config-capella.yaml \
      --config-file=/config/config.yaml \
      --beacon-node-host=http://host.docker.internal:3500 \
      --accept-terms-of-use \
      --confirm \
      --path=/withdrawal

elif [ "$1" = "validator-withdraw-38" ]; then

    docker run -it --rm \
      -v "$agora_root"/config/cl:/config \
      -v "$agora_root"/wallet/bls_change/38:/withdrawal \
      bosagora/agora-cl-ctl:agora_v4.0.3-6613b3 \
      validator withdraw \
      --chain-config-file=/config/chain-config-capella.yaml \
      --config-file=/config/config.yaml \
      --beacon-node-host=http://host.docker.internal:3500 \
      --accept-terms-of-use \
      --confirm \
      --path=/withdrawal

elif [ "$1" = "validator-withdraw-39" ]; then

    docker run -it --rm \
      -v "$agora_root"/config/cl:/config \
      -v "$agora_root"/wallet/bls_change/39:/withdrawal \
      bosagora/agora-cl-ctl:agora_v4.0.3-6613b3 \
      validator withdraw \
      --chain-config-file=/config/chain-config-capella.yaml \
      --config-file=/config/config.yaml \
      --beacon-node-host=http://host.docker.internal:3500 \
      --accept-terms-of-use \
      --confirm \
      --path=/withdrawal

elif [ "$1" = "validator-exit" ]; then

    docker run -it --rm \
      -v "$agora_root"/config/cl:/config \
      -v "$agora_root"/wallet/val5:/wallet \
      bosagora/agora-cl-ctl:agora_v4.0.3-6613b3 \
      validator exit \
      --wallet-dir=/wallet \
      --chain-config-file=/config/chain-config-capella.yaml \
      --config-file=/config/config.yaml \
      --beacon-rpc-provider=host.docker.internal:4000 \
      --accept-terms-of-use

elif [ "$1" = "start-ubuntu" ]; then

    docker-compose -f "$agora_root"/bazel/docker-compose.yml up -d

    docker exec -it ubuntu /bin/bash

elif [ "$1" = "stop-ubuntu" ]; then

    docker-compose -f "$agora_root"/bazel/docker-compose.yml down

elif [ "$1" = "start-bs-builder" ]; then

    docker-compose -f "$agora_root"/boa-scan-builder/docker-compose.yml up -d

    docker exec -it boa-scan-builder /bin/bash

elif [ "$1" = "stop-bs-builder" ]; then

    docker-compose -f "$agora_root"/boa-scan-builder/docker-compose.yml down

else

    color "31" "Process '$1' is not found!"
    color "31" "Usage: ./agora.sh PROCESS FLAGS."
    color "31" "PROCESS can be init"
    exit 1

fi
