import { NonceManager } from "@ethersproject/experimental";
import "@nomiclabs/hardhat-ethers";
import fs from "fs";
import { ethers } from "hardhat";
import { AgoraDepositContract } from "../typechain-types";
import { BOACoin } from "./utils/Amount";
import { GasPriceManager } from "./utils/GasPriceManager";

const TX_VALUE = BOACoin.make(40000).value;

function prefix0X(key: string): string {
    return `0x${key}`;
}

function delay(interval: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(resolve, interval);
    });
}

async function main() {
    const accounts: { address: string; privateKey: string }[] = JSON.parse(
        fs.readFileSync("./agora/config/el/accounts.json", "utf-8")
    );

    const contractFactory = await ethers.getContractFactory("AgoraDepositContract");
    const contract = contractFactory.attach("0x4Ca91738C7cD24895467c6d550D96BE8dC4b33AA") as AgoraDepositContract;

    const deposit_data = JSON.parse(fs.readFileSync("./agora/config/cl/deposit_data.json", "utf-8"));

    for (let idx = 0; idx < deposit_data.length; idx++) {
        console.log(`[${idx}] public key: ${deposit_data[idx].pubkey}`);

        const staker = accounts[idx + 1].address;
        const signer = new NonceManager(new GasPriceManager(ethers.provider.getSigner(staker)));
        await contract.connect(signer).deposit_with_voter(
            prefix0X(deposit_data[idx].pubkey),
            prefix0X(deposit_data[idx].withdrawal_credentials),
            prefix0X(deposit_data[idx].signature),
            prefix0X(deposit_data[idx].deposit_data_root),
            {
                voter: prefix0X(deposit_data[idx].voter.substring(24)),
                signature: prefix0X(deposit_data[idx].voter_signature),
                data_root: prefix0X(deposit_data[idx].voter_data_root),
            },
            { from: staker, value: TX_VALUE }
        );

        if ((idx + 1) % 10 === 0) await delay(10000);
        else await delay(3000);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
