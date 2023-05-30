import fs from "fs";
import axios from "axios";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
// tslint:disable-next-line:no-submodule-imports
import { HardhatUserConfig, task } from "hardhat/config";
// tslint:disable-next-line:no-submodule-imports
import { HardhatNetworkAccountUserConfig } from "hardhat/types/config";

import { utils } from "ethers";

task("wait-block", "Wait until the block is created")
    .addParam("fork", "Fork Name")
    .addParam("offset", "Block number to be added or subtracted")
    .addParam("title", "Title")
    .setAction(async (args, hre) => {
        if (args.fork === "GENESIS") {
            const fork_data = JSON.parse(fs.readFileSync("agora/adjustment/fork_data.json", "utf-8"));
            const base = Number(fork_data[args.fork + "_BLOCK_NUMBER"]);
            const offset = Number(args.offset);
            const block_number = base + offset;
            console.log(`Fork :  ${args.fork}`);
            console.log(`Offset :  ${offset}`);
            console.log(`Waiting until block number ${block_number}`);
            return new Promise<void>(async (resolve, reject) => {
                let oldIdx = 0;
                const check = async () => {
                    const block = await hre.ethers.provider.getBlock("latest");
                    if (oldIdx !== block.number)
                        console.log(`[${args.title}] block number : ${block.number}, wait until ${block_number}`);
                    oldIdx = block.number;
                    if (block_number <= block.number) {
                        resolve();
                        return;
                    } else {
                        setTimeout(check, 1000);
                    }
                };
                await check();
            });
        } else if (args.fork === "ALTAIR" || args.fork === "BELLATRIX" || args.fork === "CAPELLA") {
            const fork_data = JSON.parse(fs.readFileSync("agora/adjustment/fork_data.json", "utf-8"));
            const base = Number(fork_data[args.fork + "_SLOT"]);
            const offset = Number(args.offset);
            const slot = base + offset;
            console.log(`Fork :  ${args.fork}`);
            console.log(`Offset :  ${offset}`);
            console.log(`Waiting until slot ${slot}`);
            const client = axios.create();
            return new Promise<void>(async (resolve, reject) => {
                let oldIdx = 0;
                const check = async () => {
                    try {
                        const res = await client.get("http://localhost:3600/eth/v2/beacon/blocks/head");
                        const current_slot = Number(res.data.data.message.slot);
                        if (oldIdx !== current_slot)
                            console.log(`[${args.title}] slot : ${current_slot}, wait until ${slot}`);
                        oldIdx = current_slot;
                        if (slot <= current_slot) {
                            resolve();
                            return;
                        }
                    } catch (e) {
                        //
                    }
                    setTimeout(check, 2000);
                };
                await check();
            });
        }
    });

function getAccounts() {
    const accounts = JSON.parse(fs.readFileSync("./agora/config/el/accounts.json", "utf-8"));
    return accounts.map((m: { address: string; privateKey: string }) => m.privateKey);
}

function getTestAccounts() {
    const accounts = JSON.parse(fs.readFileSync("./agora/config/el/accounts.json", "utf-8"));
    const res: HardhatNetworkAccountUserConfig[] = [];
    const defaultBalance = utils.parseEther("100000000").toString();

    for (const m of accounts) {
        res.push({
            privateKey: m.privateKey,
            balance: defaultBalance,
        });
    }
    return res;
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.0",
            },
            {
                version: "0.8.16",
            },
        ],
        settings: {
            optimizer: {
                enabled: true,
                runs: 2000,
            },
            outputSelection: {
                "*": {
                    "*": ["storageLayout"],
                },
            },
        },
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            accounts: getTestAccounts(),
            throwOnTransactionFailures: true,
            throwOnCallFailures: true,
            blockGasLimit: 3000000000, // really high to test some things that are only possible with a higher block gas limit
            gasPrice: 8000000000,
        },
        localhost: {
            url: "http://localhost:8645",
            chainId: 1337,
            accounts: getAccounts(),
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
};

export default config;
