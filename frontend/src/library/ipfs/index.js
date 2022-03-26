import { create } from "ipfs-http-client";

const uploadAddr = "https://ipfs.infura.io:5001/api/v0";
const retrieveAddr = "https://ipfs.infura.io/ipfs/";

export const upload = async (data) => {
	const url = uploadAddr;
	const ipfs = create({ url });
	const res = await ipfs.add(data);
	return res.path;
};

export const retrieveJSON = async (hash) => {
	hash = hash.replace("ipfs://", "");
	const url = retrieveAddr + hash;
	let response = await fetch(url).then((res) => res.json());
	return response;
};

export const retrieveFile = (hash) => {
	if (hash == null) return "";
	hash = hash.replace("ipfs://", "");
	return retrieveAddr + hash;
};
