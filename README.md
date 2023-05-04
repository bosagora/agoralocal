# Local Development Environment of Agora

## Preparing

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
  - bosagora/agora-el-node:v1.0.2

- agora-cl
  - bosagora/agora-cl-bootnode:v1.0.3
  - bosagora/agora-cl-node:v1.0.3
  - bosagora/agora-cl-validator:v1.0.3

### Command

```shell
./start-ballatrix
```

### The Fork Capella

The Docker image below is used.

#### Step 1
- agora-el
    - bosagora/agora-el-bootnode:v1.0.1
    - bosagora/agora-el-node:v1.0.1

- agora-cl
    - bosagora/agora-cl-bootnode:v1.0.3
    - bosagora/agora-cl-node:v1.0.3
    - bosagora/agora-cl-validator:v1.0.3

#### Step 2 ~ Step 5
The nodes are changed sequentially one by one as follows.
- agora-el
    - bosagora/agora-el-node:v1.0.1 -> bosagora/agora-el-node:v1.0.2
- agora-el
    - bosagora/agora-cl-node:v1.0.3 -> bosagora/agora-cl-node:agora_v4.0.3-37d13b
    - bosagora/agora-cl-validator:v1.0.3 -> bosagora/agora-cl-validator:agora_v4.0.3-37d13b

#### After Step 5
- agora-el
    - bosagora/agora-el-bootnode:v1.0.1
    - bosagora/agora-el-node:v1.0.2

- agora-cl
    - bosagora/agora-cl-bootnode:v1.0.3
    - bosagora/agora-cl-node:agora_v4.0.3-37d13b
    - bosagora/agora-cl-validator:agora_v4.0.3-37d13b

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
./agora/script.sh attach
```

## Start agora-scan

```shell
./agora/script.sh start-agora-scan
```

## Start agora-scan

```shell
./agora/script.sh stop-agora-scan
```
