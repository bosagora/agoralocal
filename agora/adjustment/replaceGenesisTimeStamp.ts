import * as fs from "fs";

async function main() {
    if (process.argv.length < 4) {
        process.abort();
    }

    const fork_data = JSON.parse(fs.readFileSync("agora/adjustment/fork_data.json", "utf-8"));
    const inputFileName = process.argv[2];
    const outFileFileName = process.argv[3];

    console.log(`Input FileName : ${inputFileName}`);
    console.log(`Output FileName : ${outFileFileName}`);

    try {
        let contents = fs.readFileSync(inputFileName, "utf-8");
        contents = contents.replace(/REPLACE_GENESIS_TIME_STAMP/g, fork_data.GENESIS_TIME);
        contents = contents.replace(/REPLACE_CAPELLA_TIME_STAMP/g, fork_data.CAPELLA_TIME);
        contents = contents.replace(/REPLACE_SHANGHAI_TIME_STAMP/g, fork_data.SHANGHAI_TIME);

        contents = contents.replace(/REPLACE_ALTAIR_EPOCH/g, fork_data.ALTAIR_EPOCH);
        contents = contents.replace(/REPLACE_BELLATRIX_EPOCH/g, fork_data.BELLATRIX_EPOCH);
        contents = contents.replace(/REPLACE_CAPELLA_EPOCH/g, fork_data.CAPELLA_EPOCH);

        contents = contents.replace(/REPLACE_NET_SPLIT_BLOCK/g, (fork_data.BELLATRIX_BLOCK_NUMBER - 10).toString());

        contents = contents.replace(
            /REPLACE_TERMINAL_TOTAL_DIFFICULTY/g,
            (fork_data.BELLATRIX_BLOCK_NUMBER * 2).toString()
        );

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
