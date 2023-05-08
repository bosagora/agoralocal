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
    balance: string;
    credentials: string;
    validatorIndex: number;
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

async function main() {
    const result: IValidatorInfo[] = [];
    const validatorKeysPath = "agora/wallet";

    const client = axios.create();
    const fileList: IKeyFile[] = await getKeyFiles(validatorKeysPath);
    for (const file of fileList) {
        const s = file.name.split("_");
        const fullFileName = path.resolve(file.path, file.name);
        const keyData = JSON.parse(fs.readFileSync(fullFileName, "utf-8"));
        const keyIndex = Number(s[3]);
        const validatorKey = keyData.pubkey;
        const res = await client.get(
            `http://localhost:3500/eth/v1/beacon/states/head/validators/${prefix0X(validatorKey)}`
        );
        const balance = res.data.data.balance;
        const credentials = res.data.data.validator.withdrawal_credentials.replace("0x", "");
        const validatorIndex = Number(res.data.data.index);
        result.push({ keyIndex, validatorKey, balance, credentials, validatorIndex });
    }
    console.log(beautify(JSON.stringify(result.sort((a, b) => a.keyIndex - b.keyIndex)), { format: "json" }));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
