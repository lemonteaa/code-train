import { create } from "ipfs-http-client";

export const readFromIPFS = async (path) => {
    const client = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https"
    });

    const res = [];
    const data = await client.cat(path);
    for await (let byte of data) {
        const thisRound = Array.from(byte)
        .map((x) => {
            return String.fromCharCode(x);
        })
        .join("");
        res.push(thisRound);
    }
    return res.join("");
    //console.log(String.fromCharCode(72));
}
