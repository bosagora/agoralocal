import "hardhat-deploy";

// tslint:disable-next-line:no-submodule-imports
import { DeployFunction } from "hardhat-deploy/types";
// tslint:disable-next-line:no-submodule-imports
import { HardhatRuntimeEnvironment } from "hardhat/types";

async function waitForBlock(blockNumber: number, hre: HardhatRuntimeEnvironment): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        let oldIdx = 0;
        const check = async () => {
            const block = await hre.ethers.provider.getBlock("latest");
            if (oldIdx !== block.number) console.log("block number is ", block.number);
            oldIdx = block.number;
            if (blockNumber === block.number) {
                resolve();
                return;
            } else {
                setTimeout(check, 1000);
            }
        };
        await check();
    });
}
// tslint:disable-next-line:only-arrow-functions
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    console.log(`\nDeploying AgoraDepositContract.`);

    const { deployments, getNamedAccounts, ethers } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await waitForBlock(5, hre);
    await deploy("AgoraDepositContract", {
        from: deployer,
        args: [],
        log: true,
    });
};
export default func;
func.tags = ["AgoraDepositContract"];
