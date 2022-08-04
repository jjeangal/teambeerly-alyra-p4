import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export default function web3Handler() {
    const sdk = new ThirdwebSDK("Rinkeby");
    let NFT, Marketplace;

    const getContract = async () => {
        NFT = sdk.getContract("0x5fbdb2315678afecb367f032d93f642f64180aa3");
        Marketplace = sdk.getContract(
            "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
        );
    };

    getContract();
}
