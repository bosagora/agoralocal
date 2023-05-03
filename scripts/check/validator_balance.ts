// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat

import { Amount, GBOACoin } from "../utils/Amount";

import { BigNumber } from "ethers";

import axios from "axios";
import URI from "urijs";

// tslint:disable-next-line:no-var-requires
const parsePrometheusTextFormat = require("parse-prometheus-text-format");
// tslint:disable-next-line:no-var-requires
const beautify = require("beautify");

function delay(interval: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(resolve, interval);
    });
}
async function main() {
    let oldValue = BigNumber.from(0);
    const client = axios.create();
    while (true) {
        try {
            const url = URI("http://localhost:8080/").filename("metrics").toString();
            const res = await client.get(url);

            const data: string = res.data;

            const lines = data.split("\n");
            const balances: string[] = [];
            const validators: string[] = [];
            const slots: string[] = [];
            for (let idx = 0; idx < lines.length; idx++) {
                if (lines[idx].trim() === "# HELP validators_total_balance The total balance of validators, in GWei") {
                    for (let j = 0; j < 12; j++) {
                        balances.push(lines[idx + j]);
                    }
                }
                if (lines[idx].trim() === "# HELP beacon_current_active_validators Current total active validators") {
                    for (let j = 0; j < 4; j++) {
                        validators.push(lines[idx + j]);
                    }
                }
                if (lines[idx].trim() === "# HELP beacon_slot Latest slot of the beacon chain state") {
                    for (let j = 0; j < 4; j++) {
                        slots.push(lines[idx + j]);
                    }
                }
            }
            const parsedBalances = parsePrometheusTextFormat(balances.join("\n"));
            const parsedValidators = parsePrometheusTextFormat(validators.join("\n"));
            const parsedSlots = parsePrometheusTextFormat(slots.join("\n"));
            const validators_total_balance = BigNumber.from(Number(parsedBalances[0].metrics[0].value));
            const validators_total_effective_balance = BigNumber.from(Number(parsedBalances[1].metrics[0].value));

            if (!oldValue.eq(validators_total_balance)) {
                console.log(
                    `epoch : ${Math.floor(Number(parsedSlots[0].metrics[0].value) / 32)}, slot : ${Number(
                        parsedSlots[0].metrics[0].value
                    )}, validators : ${Number(parsedValidators[0].metrics[0].value)}, total : ${new GBOACoin(
                        validators_total_balance
                    ).toBOAString()}, effective : ${new GBOACoin(
                        validators_total_effective_balance
                    ).toBOAString()}, reward: ${new GBOACoin(validators_total_balance.sub(oldValue)).toBOAString()}`
                );
                oldValue = validators_total_balance;
            }
        } catch (e) {
            //
        }
        await delay(5000);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
