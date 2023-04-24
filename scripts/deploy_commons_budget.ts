import { NonceManager } from "@ethersproject/experimental";
import "@nomiclabs/hardhat-ethers";
import fs from "fs";
import { ethers } from "hardhat";
import { GasPriceManager } from "./utils/GasPriceManager";

async function main() {
    console.log(`\nDeploying CommonsBudgetContract.`);

    const accounts: { address: string; privateKey: string }[] = JSON.parse(
        fs.readFileSync("./agora/config/el/accounts.json", "utf-8")
    );
    const deployer = accounts[0].address;
    const signer = new NonceManager(new GasPriceManager(ethers.provider.getSigner(deployer)));
    const contractFactory = await ethers.getContractFactory("IssuedContract");
    const contract = await contractFactory.connect(signer).deploy();
    await contract.deployed();

    console.log("IssuedContract - deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
