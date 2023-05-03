// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat

import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

import { Amount } from "../utils/Amount";

function delay(interval: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(resolve, interval);
    });
}
async function main() {
    let block_number = 0;
    while (true) {
        try {
            const block = await ethers.provider.getBlock("latest");
            if (block_number !== block.number) {
                const balance1 = new Amount(
                    await ethers.provider.getBalance("0xFDa3d1ff3C570c2f76c2157Ef7A8640A75794eD9"),
                    18
                );

                console.log(`${block.number} - ${block.timestamp} - ${balance1.toBOAString()}`);

                block_number = block.number;
            }
        } catch (e) {}
        await delay(1000);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
