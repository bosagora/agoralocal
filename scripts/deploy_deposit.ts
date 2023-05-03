import { NonceManager } from "@ethersproject/experimental";
import "@nomiclabs/hardhat-ethers";
import fs from "fs";
import { ethers } from "hardhat";
import { GasPriceManager } from "./utils/GasPriceManager";

async function waitForBlock(blockNumber: number): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        let oldIdx = 0;
        const check = async () => {
            const block = await ethers.provider.getBlock("latest");
            if (oldIdx !== block.number) console.log("block number is ", block.number);
            oldIdx = block.number;
            if (blockNumber <= block.number) {
                resolve();
                return;
            } else {
                setTimeout(check, 1000);
            }
        };
        await check();
    });
}

async function main() {
    console.log(`\nWaiting for block number 5.`);

    const accounts: { address: string; privateKey: string }[] = JSON.parse(
        fs.readFileSync("./agora/config/el/accounts.json", "utf-8")
    );

    await waitForBlock(4);
    console.log(`\nDeploying AgoraDepositContract.`);
    const deployer = accounts[0].address;
    const signer = new NonceManager(new GasPriceManager(ethers.provider.getSigner(deployer)));
    const contractFactory = await ethers.getContractFactory("AgoraDepositContract");
    const contract = await contractFactory.connect(signer).deploy();
    await contract.deployed();

    const receipt = await contract.deployTransaction.wait();

    console.log("deployed to (address) :", contract.address);
    console.log("deployed at (blockNumber) :", receipt.blockNumber);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
