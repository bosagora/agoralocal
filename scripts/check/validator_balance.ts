// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat

import axios from "axios";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import URI from "urijs";
import { BOACoin } from "../utils/Amount";

// tslint:disable-next-line:no-var-requires
const parsePrometheusTextFormat = require("parse-prometheus-text-format");

function delay(interval: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(resolve, interval);
    });
}
async function main() {
    const unit = BigNumber.from("1000000000");
    const zero = BigNumber.from(0);
    let oldValue = BigNumber.from(0);
    const client = axios.create();
    let oldEpoch = 0;
    let newEpoch = 0;
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
            // 초기 40개의 검증자중 인출주소가 등록된 32, 33번째 검증자는 인출주소로 리워드가 전송되기 때문에 리워드를 계산하기 위해 인출된 잔고를 확인한다.
            const withdrawnRewards32 = await ethers.provider.getBalance("0xfF51d5A38b25AEc6Eb95a7De6835119372110317");
            const withdrawnRewards33 = await ethers.provider.getBalance("0x28B248671efef5eAd82eD2AaEC88671DA09F6b64");

            const parsedBalances = parsePrometheusTextFormat(balances.join("\n"));
            const parsedValidators = parsePrometheusTextFormat(validators.join("\n"));
            const parsedSlots = parsePrometheusTextFormat(slots.join("\n"));
            const validators_total_balance = BigNumber.from(Number(parsedBalances[0].metrics[0].value))
                .mul(unit)
                .add(withdrawnRewards32)
                .add(withdrawnRewards33);
            const validators_total_effective_balance = BigNumber.from(Number(parsedBalances[1].metrics[0].value)).mul(
                unit
            );
            const validators_total_reward = oldValue.eq(zero)
                ? BigNumber.from(zero)
                : validators_total_balance.sub(oldValue);
            newEpoch = Math.floor(Number(parsedSlots[0].metrics[0].value) / 32);
            if (newEpoch !== oldEpoch) {
                console.log(
                    `Withdrawn Rewards (32): ${new BOACoin(withdrawnRewards32).toBOAString()}; (33) : ${new BOACoin(
                        withdrawnRewards33
                    ).toBOAString()}`
                );
                console.log(
                    `epoch : ${newEpoch}, slot : ${Number(parsedSlots[0].metrics[0].value)}, validators : ${Number(
                        parsedValidators[0].metrics[0].value
                    )}, total : ${new BOACoin(validators_total_balance).toBOAString()}, effective : ${new BOACoin(
                        validators_total_effective_balance
                    ).toBOAString()}, reward: ${new BOACoin(validators_total_reward).toBOAString()}`
                );
                oldValue = validators_total_balance;
                oldEpoch = newEpoch;
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
