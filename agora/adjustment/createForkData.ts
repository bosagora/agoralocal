import * as dotenv from "dotenv";
import * as fs from "fs";

// tslint:disable-next-line:no-var-requires
const beautify = require("beautify");

dotenv.config();

interface IForkData {
    SECONDS_PER_BLOCK: number;
    SECONDS_PER_SLOT: number;
    GENESIS_TIME: number;
    GENESIS_EPOCH: number;
    GENESIS_SLOT: number;
    GENESIS_BLOCK_NUMBER: number;
    GENESIS_OFFSET: number;
    ALTAIR_TIME: number;
    ALTAIR_EPOCH: number;
    ALTAIR_SLOT: number;
    BELLATRIX_TIME: number;
    BELLATRIX_EPOCH: number;
    BELLATRIX_SLOT: number;
    BELLATRIX_BLOCK_NUMBER: number;
    CAPELLA_TIME: number;
    CAPELLA_EPOCH: number;
    CAPELLA_SLOT: number;
    SHANGHAI_TIME: number;
    SHANGHAI_EPOCH: number;
    SHANGHAI_SLOT: number;
}

const block_speed = process.env.BLOCK_SPEED || "SLOW";
const slotPerEpoch = 32;
const secondsPerSlot = block_speed === "FAST" ? 5 : 12;
const secondsPerBlock = block_speed === "FAST" ? 5 : 14;
const genesisBlockNumber = block_speed === "FAST" ? 60 : 27;
const timestamp = Math.floor(new Date().getTime() / 1000) + secondsPerBlock * genesisBlockNumber;
// tslint:disable-next-line:no-object-literal-type-assertion
const forkData: IForkData = {} as IForkData;

forkData.SECONDS_PER_BLOCK = secondsPerBlock;
forkData.SECONDS_PER_SLOT = secondsPerSlot;
forkData.GENESIS_EPOCH = 0;
forkData.ALTAIR_EPOCH = 1;
forkData.BELLATRIX_EPOCH = 2;
forkData.CAPELLA_EPOCH = 6;
forkData.SHANGHAI_EPOCH = 6;

forkData.GENESIS_SLOT = forkData.GENESIS_EPOCH * slotPerEpoch;
forkData.ALTAIR_SLOT = forkData.ALTAIR_EPOCH * slotPerEpoch;
forkData.BELLATRIX_SLOT = forkData.BELLATRIX_EPOCH * slotPerEpoch;
forkData.CAPELLA_SLOT = forkData.CAPELLA_EPOCH * slotPerEpoch;
forkData.SHANGHAI_SLOT = forkData.SHANGHAI_EPOCH * slotPerEpoch;

forkData.GENESIS_TIME = timestamp;
forkData.ALTAIR_TIME = forkData.GENESIS_TIME + forkData.ALTAIR_SLOT * secondsPerSlot;
forkData.BELLATRIX_TIME = forkData.GENESIS_TIME + forkData.BELLATRIX_SLOT * secondsPerSlot;
forkData.CAPELLA_TIME = forkData.GENESIS_TIME + forkData.CAPELLA_SLOT * secondsPerSlot;
forkData.SHANGHAI_TIME = forkData.GENESIS_TIME + forkData.SHANGHAI_SLOT * secondsPerSlot;

forkData.GENESIS_OFFSET = 3;
forkData.GENESIS_BLOCK_NUMBER = genesisBlockNumber - forkData.GENESIS_OFFSET;
forkData.BELLATRIX_BLOCK_NUMBER =
    forkData.GENESIS_BLOCK_NUMBER + Math.ceil((forkData.BELLATRIX_SLOT * secondsPerSlot) / secondsPerBlock);
forkData.BELLATRIX_BLOCK_NUMBER = Math.ceil(forkData.BELLATRIX_BLOCK_NUMBER / 5) * 5;

fs.writeFileSync("agora/adjustment/fork_data.json", beautify(JSON.stringify(forkData), { format: "json" }), "utf-8");
