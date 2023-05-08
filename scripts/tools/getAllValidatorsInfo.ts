import axios from "axios";
import fs from "fs";

// tslint:disable-next-line:no-var-requires
const beautify = require("beautify");

function prefix0X(key: string): string {
    return `0x${key}`;
}

async function main() {
    const result: { key_index: number; key: string; balance: string; credentials: string; index: number }[] = [];

    try {
        const deposit_data = JSON.parse(fs.readFileSync("./agora/config/cl/deposit_data.json", "utf-8"));
        const client = axios.create();
        let key_index = 0;
        for (const data of deposit_data) {
            const res = await client.get(
                `http://localhost:3500/eth/v1/beacon/states/head/validators/${prefix0X(data.pubkey)}`
            );
            result.push({
                key_index: Number(key_index),
                balance: res.data.data.balance,
                key: data.pubkey,
                credentials: res.data.data.validator.withdrawal_credentials.replace("0x", ""),
                index: Number(res.data.data.index),
            });
            key_index++;
        }
        console.log(beautify(JSON.stringify(result), { format: "json" }));
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
