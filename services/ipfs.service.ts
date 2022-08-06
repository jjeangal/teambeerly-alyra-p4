import { infuraPort, infuraUrl } from "../context/constants";
import { create } from "ipfs-http-client";

export const ipfsGateway = "https://ipfs.io/ipfs";
const ipfsInfura = "https://ipfs.infura.io/ipfs";

// Create IPFS clients
const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || "";
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET || "";
const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
    host: infuraUrl,
    port: infuraPort,
    protocol: "https",
    headers: {
        authorization: auth,
    },
});

const uploadFileToIPFS = async (file: any): Promise<any> => {
    try {
        const added = await client.add(file);
        return Promise.resolve(`${ipfsInfura}/${added.path}`);
    } catch (error) {
        console.log("Error when uploading file to IPFS:", error);
        return Promise.reject(error);
    }
};

const uploadMetaDataIPFS = async (json: any): Promise<any> => {
    try {
        return await fetch(`http://${infuraUrl}:${infuraPort}/api/v0/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: auth,
            },
            body: JSON.stringify(json),
        });
    } catch (error) {
        console.log("Error when uploading file (json) to IPFS:", error);
        return Promise.reject(error);
    }
};

const uploadFolderToIPFS = async (files: any) => {
    console.log(
        "🔎 ~ file: ipfs.service.ts ~ line 65 ~ uploadFolderToIPFS ~ files",
        files
    );

    const filesToUpload = [];

    for (const fileIndex in Array.from(files)) {
        filesToUpload.push({
            path: files[fileIndex].name,
            content: files[fileIndex],
        });
    }

    try {
        const addedFiles = [];
        const options = {
            wrapWithDirectory: true,
            recursive: true,
        };
        for await (const file of client.addAll(filesToUpload, options)) {
            addedFiles.push({
                cid: file.cid.toString(),
                path: file.path,
                size: file.size,
            });
        }
        return addedFiles;
    } catch (error) {
        console.log("Error when uploading file to IPFS:", error);
    }
};

const getIPFSImageUrl = (collectionCID: string, imageUrl?: string): string => {
    const _imageUrl = imageUrl ? `/${imageUrl}` : ``;
    return `${ipfsGateway}/${collectionCID}${_imageUrl}`;
};

const getToken = async (params: any): Promise<any> => {
    const collectionCIDJson = params[0];
    const tokenId = params[1];
    try {
        const fetchResponse = await fetch(
            `${ipfsGateway}/${collectionCIDJson}/${tokenId}.json`
        );
        if (fetchResponse.ok) {
            const tokenMetaData = await fetchResponse.json();
            return Promise.resolve(tokenMetaData);
        } else {
            alert("HTTP-Error: " + fetchResponse.status);
        }
    } catch (error) {
        console.log("Error when fetching token metadata : ", error);
        return Promise.reject(error);
    }
};

export {
    getIPFSImageUrl,
    uploadMetaDataIPFS,
    uploadFileToIPFS,
    uploadFolderToIPFS,
    getToken,
};
