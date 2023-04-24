import fs from "fs";

import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";
// tslint:disable-next-line:no-submodule-imports
import { HardhatUserConfig } from "hardhat/config";
// tslint:disable-next-line:no-submodule-imports
import { HardhatNetworkAccountUserConfig } from "hardhat/types/config";

import { utils } from "ethers";

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
            deploy: ["./deploy"],
        },
        localhost: {
            url: "http://localhost:8545",
            chainId: 1337,
            accounts: getAccounts(),
            deploy: ["./deploy"],
        },
    },
    namedAccounts: {
        deployer: 0,
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
        deploy: "./deploy",
    },
};

export default config;
