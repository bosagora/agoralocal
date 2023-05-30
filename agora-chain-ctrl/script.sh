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
if [ $dirname = "agora-chain-ctrl" ]; then
  agora_root="$(pwd)"
fi

if [ "$1" = "new-mnemonic" ]; then

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

    hardhat run "$agora_root"/scripts/staking-agora-chain.ts --network localhost

fi
