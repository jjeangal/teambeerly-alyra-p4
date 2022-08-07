import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-identicon-sprites";

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

export { getAvatar, stripAddress };
