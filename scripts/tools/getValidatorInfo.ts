import axios from "axios";
import fs from "fs";

// tslint:disable-next-line:no-var-requires
const beautify = require("beautify");

function prefix0X(key: string): string {
    return `0x${key}`;
}

async function main() {
    if (process.argv.length < 3) {
        console.log(`npx ts-node getValidatorInfo.ts validator_key`);
        process.abort();
    }

    const validator_key = String(process.argv[2]).replace("0x", "");

    try {
        const client = axios.create();
        const res = await client.get(
            `http://localhost:3500/eth/v1/beacon/states/head/validators/${prefix0X(validator_key)}`
        );
        console.log(beautify(JSON.stringify(res.data), { format: "json" }));
    } catch (error) {
        console.log(error);
    }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
