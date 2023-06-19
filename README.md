# Local Development Environment of Agora

## Preparing

### Install submodules

```shell
git submodule update --init
```

### Install mpm modules

```shell
npm install
```

### Compile Smart Contract

```shell
npm run build
```

### Create .env

```shell
cp .env.sample .env
```

The value of the environment variable 'BLOCK_SPEED' is one of 'SLOW' and 'FAST'.  
When 'SLOW', the creation period of the block is 14 seconds for agora-el and 12 seconds for agora-cl.  
When 'FAST', the creation period of the block is 5 seconds for agora-el and 5 seconds for agora-cl.  

## Run nodes

### The Fork Bellatrix

The Docker image below is used.
- agora-el  
  - bosagora/agora-el-bootnode:v1.0.2
  - bosagora/agora-el-node:v2.0.0

- agora-cl
  - bosagora/agora-cl-bootnode:v1.0.3
  - bosagora/agora-cl-node:v1.0.3
  - bosagora/agora-cl-validator:v1.0.3

### Command

```shell
./start-bellatrix
```

### The Fork Capella

The Docker image below is used.

#### Step 1
- agora-el
    - bosagora/agora-el-bootnode:v1.0.2
    - bosagora/agora-el-node:v1.0.2

- agora-cl
    - bosagora/agora-cl-bootnode:v1.0.3
    - bosagora/agora-cl-node:v1.0.3
    - bosagora/agora-cl-validator:v1.0.3

#### Step 2 ~ Step 6
The nodes are changed sequentially one by one as follows.
- agora-el
    - bosagora/agora-el-bootnode:v1.0.2
    - bosagora/agora-el-node:v1.0.2 -> bosagora/agora-el-node:v2.0.0
- agora-cl
    - bosagora/agora-cl-bootnode:v1.0.3
    - bosagora/agora-cl-node:v1.0.3 -> bosagora/agora-cl-node:v2.0.0
    - bosagora/agora-cl-validator:v1.0.3 -> bosagora/agora-cl-validator:v2.0.0

#### After Step 6
- agora-el
    - bosagora/agora-el-bootnode:v1.0.2
    - bosagora/agora-el-node:v2.0.0

- agora-cl
    - bosagora/agora-cl-bootnode:v1.0.3
    - bosagora/agora-cl-node:v2.0.0
    - bosagora/agora-cl-validator:v2.0.0

### Command

```shell
./start-capella
```

## Stop nodes

```shell
./stop
```

## Attach agora-el node

```shell
./agora/cmd.sh attach
```

## Start agora-scan

```shell
./agora/cmd.sh start-agora-scan
```

## Stop agora-scan

```shell
./agora/cmd.sh stop-agora-scan
```
