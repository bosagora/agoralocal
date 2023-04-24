import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
// tslint:disable-next-line:no-submodule-imports
import { HardhatRuntimeEnvironment } from "hardhat/types";

export async function getContractAddress(contractName: string, hre: HardhatRuntimeEnvironment): Promise<string> {
    const { deployments } = hre;
    try {
        const contract = await deployments.get(contractName);
        if (contract) {
            return contract.address;
        } else {
            return "";
        }
    } catch (e) {
        console.error(e);
        return "";
    }
}

export function delay(interval: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(resolve, interval);
    });
}

// exports dummy function for hardhat-deploy. Otherwise we would have to move this file
export default function () {
    //
}
