import * as fs from "fs";
// tslint:disable-next-line:no-var-requires
const beautify = require("beautify");

const timestamp = Math.floor(new Date().getTime() / 1000) + 14 * 30;
const res = {
    GENESIS_TIME: timestamp,
    GENESIS_SLOT: 0,
    GENESIS_BLOCK_NUMBER: 30,
    ALTAIR_FORK_TIME: timestamp + 2 * 12 * 32,
    ALTAIR_FORK_SLOT: 2 * 32,
    ALTAIR_FORK_BLOCK_NUMBER: 84,
    BELLATRIX_FORK_TIME: timestamp + 3 * 12 * 32,
    BELLATRIX_FORK_SLOT: 3 * 32,
    BELLATRIX_BLOCK_NUMBER: 115,
    CAPELLA_FORK_TIME: 0,
    CAPELLA_FORK_SLOT: 0,
    CAPELLA_BLOCK_NUMBER: 0,
};

fs.writeFileSync("agora/adjustment/fork_data.json", beautify(JSON.stringify(res), { format: "json" }), "utf-8");
