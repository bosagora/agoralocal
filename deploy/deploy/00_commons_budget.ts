import "hardhat-deploy";

// tslint:disable-next-line:no-submodule-imports
import { DeployFunction } from "hardhat-deploy/types";
// tslint:disable-next-line:no-submodule-imports
import { HardhatRuntimeEnvironment } from "hardhat/types";

// tslint:disable-next-line:only-arrow-functions
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    console.log(`\nDeploying CommonsBudget.`);

    const { deployments, getNamedAccounts, ethers } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy("IssuedContract", {
        from: deployer,
        args: [],
        log: true,
    });
};
export default func;
func.tags = ["IssuedContract"];
