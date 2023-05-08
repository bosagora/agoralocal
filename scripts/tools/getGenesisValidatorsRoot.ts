import axios from "axios";

async function main() {
    try {
        const client = axios.create();
        const mainnet_res = await client.get("https://mainnet-sync.bosagora.org/eth/v2/debug/beacon/states/genesis");
        console.log(`main net : ${mainnet_res.data.data.genesis_validators_root}`);

        const testnet_res = await client.get("https://testnet-sync.bosagora.org/eth/v2/debug/beacon/states/genesis");
        console.log(`test net : ${testnet_res.data.data.genesis_validators_root}`);

        const devnet_res = await client.get("http://localhost:3500/eth/v2/debug/beacon/states/genesis");
        console.log(`dev net  : ${devnet_res.data.data.genesis_validators_root}`);
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
