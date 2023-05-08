import axios from "axios";
import fs from "fs";
import path from "path";

// tslint:disable-next-line:no-var-requires
const beautify = require("beautify");

function prefix0X(key: string): string {
    return `0x${key}`;
}

interface IKeyFile {
    path: string;
    name: string;
}
interface IValidatorInfo {
    keyIndex: number;
    validatorKey: string;
}
async function getKeyFiles(keyPath: string): Promise<IKeyFile[]> {
    return new Promise<IKeyFile[]>((resolve, reject) => {
        const res: IKeyFile[] = [];
        fs.readdir(keyPath, { withFileTypes: true }, async function (error, fileList) {
            for (const file of fileList) {
                if (file.isDirectory()) {
                    const subKeys = await getKeyFiles(path.resolve(keyPath, file.name));
                    for (const subFile of subKeys) {
                        if (res.find((m) => m.name === subFile.name) === undefined) {
                            res.push(subFile);
                        }
                    }
                } else if (file.isFile()) {
                    if (file.name.indexOf("keystore") === 0) {
                        if (res.find((m) => m.name === file.name) === undefined) {
                            res.push({
                                path: keyPath,
                                name: file.name,
                            });
                        }
                    }
                }
            }
            resolve(res);
        });
    });
}

async function getAllValidatorsInfo(): Promise<IValidatorInfo[]> {
    const result: IValidatorInfo[] = [];
    const validatorKeysPath = "agora/wallet";
    const fileList: IKeyFile[] = await getKeyFiles(validatorKeysPath);
    for (const file of fileList) {
        const s = file.name.split("_");
        const fullFileName = path.resolve(file.path, file.name);
        const keyData = JSON.parse(fs.readFileSync(fullFileName, "utf-8"));
        const keyIndex = Number(s[3]);
        const validatorKey = keyData.pubkey;
        result.push({ keyIndex, validatorKey });
    }

    return result;
}
async function main() {
    if (process.argv.length < 3) {
        console.log(`npx ts-node getValidatorInfo.ts validator_key`);
        process.abort();
    }

    const validator_key = String(process.argv[2]).replace("0x", "");

    const result: IValidatorInfo[] = await getAllValidatorsInfo();
    const found = result.find((m) => m.validatorKey === validator_key);
    if (found === undefined) {
        console.error("Can not found key files");
    } else {
        console.log("validator key : ", found.validatorKey);
        console.log("key index : ", found.keyIndex);
    }

    try {
        const client = axios.create();
        const res = await client.get(
            `http://localhost:3500/eth/v1/beacon/states/head/validators/${prefix0X(validator_key)}`
        );
        console.log(beautify(JSON.stringify(res.data), { format: "json" }));
    } catch (error) {
        console.log(error);
    }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
