import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-identicon-sprites";

// Use this with local IPFS Node
// const ipfsGateway = "http://127.0.0.1:8080/ipfs";
const ipfsGateway = "https://gateway.pinata.cloud/ipfs";

const getAvatar = function (seed: string): string {
    return createAvatar(style, {
        seed,
        dataUri: true,
        rotate: 90,
        backgroundColor: "#fff",
    });
};

const stripAddress = function (address: string) {
    const beginning = address.slice(0, 6);
    const end = address.slice(address.length - 4);
    return `${beginning}...${end}`;
};

const getImageUrl = function (imageUrl: string): string {
    return `${ipfsGateway}/${imageUrl}`;
};

export { getAvatar, stripAddress, getImageUrl };
