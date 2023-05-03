import * as fs from "fs";

async function main() {
    if (process.argv.length < 4) {
        process.abort();
    }

    const fork_data = JSON.parse(fs.readFileSync("agora/adjustment/fork_data.json", "utf-8"));
    const value = fork_data.GENESIS_TIME;
    const inputFileName = process.argv[2];
    const outFileFileName = process.argv[3];

    console.log(`Value: ${value}`);
    console.log(`Input FileName : ${inputFileName}`);
    console.log(`Output FileName : ${outFileFileName}`);

    try {
        let contents = fs.readFileSync(inputFileName, "utf-8");
        contents = contents.replace(/REPLACE_GENESIS_TIME_STAMP/g, value);
        fs.writeFileSync(outFileFileName, contents, "utf-8");
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
