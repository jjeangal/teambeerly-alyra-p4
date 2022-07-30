import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-identicon-sprites";

const defaultItemImage = `https://images.unsplash.com/photo-1613542231149-63eb74d8b4ef
?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1972&q=80`;

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

export { defaultItemImage, getAvatar, stripAddress };
