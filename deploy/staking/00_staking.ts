import "hardhat-deploy";

import { BigNumber } from "ethers";
import fs from "fs";
// tslint:disable-next-line:no-submodule-imports
import { DeployFunction } from "hardhat-deploy/types";
// tslint:disable-next-line:no-submodule-imports
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { AgoraDepositContract } from "../../typechain-types";
import { delay, getContractAddress } from "../helpers";

const TX_VALUE = BigNumber.from("40000000000000000000000");

function prefix0X(key: string): string {
    return `0x${key}`;
}

// tslint:disable-next-line:only-arrow-functions
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    console.log(`\nDeploying AgoraDepositContract.`);

    const { deployments, getNamedAccounts, ethers } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const depositContractAddress = await getContractAddress("AgoraDepositContract", hre);
    const depositContract = (await ethers.getContractAt(
        "AgoraDepositContract",
        depositContractAddress
    )) as AgoraDepositContract;
    const deposit_data = JSON.parse(fs.readFileSync("./agora/config/cl/deposit_data.json", "utf-8"));

    const accounts: { address: string; privateKey: string }[] = JSON.parse(
        fs.readFileSync("./agora/config/el/accounts.json", "utf-8")
    );
    for (let idx = 0; idx < deposit_data.length; idx++) {
        const account = accounts[idx + 1];
        console.log(`[${idx}] public key: ${deposit_data[idx].pubkey}`);

        await depositContract.connect(await ethers.getSigner(account.address)).deposit_with_voter(
            prefix0X(deposit_data[idx].pubkey),
            prefix0X(deposit_data[idx].withdrawal_credentials),
            prefix0X(deposit_data[idx].signature),
            prefix0X(deposit_data[idx].deposit_data_root),
            {
                voter: prefix0X(deposit_data[idx].voter.substring(24)),
                signature: prefix0X(deposit_data[idx].voter_signature),
                data_root: prefix0X(deposit_data[idx].voter_data_root),
            },
            { from: account.address, value: TX_VALUE }
        );

        if ((idx + 1) % 10 === 0) await delay(10000);
        else await delay(4000);
    }
};
export default func;
func.tags = ["Staking"];
func.dependencies = ["AgoraDepositContract"];
