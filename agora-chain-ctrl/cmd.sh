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
agora_root="$(pwd)/agora-chain-ctrl"
if [ "$dirname" = "agora-chain-ctrl" ]; then
  agora_root="$(pwd)"
fi

if [ "$1" = "start" ]; then

    cp -f "$agora_root"/../agora/config/cl/chain-config-capella.yaml "$agora_root"/../agora-chain/root/config/cl/chain-config.yaml
    cp -f "$agora_root"/../agora/config/el/genesis-shanghai.json "$agora_root"/../agora-chain/root/config/el/genesis.json
    cp -rf "$agora_root"/wallet "$agora_root"/../agora-chain/root/

    cd "$agora_root"/../agora-chain/
    if [ "$system" == "linux" ]; then
        sudo rm -rf root/chain
    else
        rm -rf root/chain
    fi
    ./agora.sh el-node init
    sleep 2
    ./agora.sh docker-compose-monitoring up -d

elif [ "$1" = "stop" ]; then

    cd "$agora_root"/../agora-chain/
    ./agora.sh docker-compose-monitoring down

elif [ "$1" = "new-mnemonic" ]; then

    docker run -it --rm \
      -v "$agora_root"/validator_keys:/app/validator_keys \
      bosagora/agora-deposit-cli:agora_v2.5.0-1839d2 \
      --language=english \
      new-mnemonic \
      --chain=devnet

elif [ "$1" = "existing-mnemonic" ]; then

    echo "Mnemonic : board fire prize defy limb arm diet fee usage settle rigid sunny duty squirrel cheap history session same tilt candy loan culture pretty anchor"

    docker run -it --rm \
      -v "$agora_root"/validator_keys:/app/validator_keys \
      bosagora/agora-deposit-cli:agora_v2.5.0-1839d2 \
      --language=english \
      existing-mnemonic \
      --chain=devnet

elif [ "$1" = "staking" ]; then

    npx hardhat run "$agora_root"/scripts/staking-agora-chain.ts --network localhost

elif [ "$1" = "replace" ]; then

    cd "$agora_root"/../agora-chain/

    if [[ -n $(docker-compose ls | grep "docker-compose-monitoring") ]]
    then
      ./agora.sh docker-compose-monitoring down
      sleep 2
    fi

    cp -f "$agora_root"/../agora/config/cl/chain-config-capella.yaml "$agora_root"/../agora-chain/root/config/cl/chain-config.yaml
    cp -f "$agora_root"/../agora/config/el/genesis-shanghai.json "$agora_root"/../agora-chain/root/config/el/genesis.json

    cp -rf "$agora_root"/../agora/wallet/val5 "$agora_root"/../agora-chain/root/
    rm -rf "$agora_root"/../agora-chain/root/wallet
    mv "$agora_root"/../agora-chain/root/val5 "$agora_root"/../agora-chain/root/wallet
    cp -f "$agora_root"/../agora/config/cl/private/password.txt "$agora_root"/../agora-chain/root/config/cl/password.txt

    if [ "$system" == "linux" ]; then
        sudo rm -rf root/chain
    else
        rm -rf root/chain
    fi

    mkdir -p root/chain

    if docker ps | grep -q 'node5-3-val'
    then
        docker stop node5-3-val
        docker rm node5-3-val
    fi

    if docker ps | grep -q 'node5-2-cl'
    then
        docker stop node5-2-cl
        docker rm node5-2-cl
    fi

    if docker ps | grep -q 'node5-1-el'
    then
        docker stop node5-1-el
        docker rm node5-1-el
    fi

    cp -rf "$agora_root"/../agora/chain/node5/* "$agora_root"/../agora-chain/root/chain

    sleep 2

    ./agora.sh docker-compose-monitoring up -d

fi
