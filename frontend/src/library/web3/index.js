import { ethers } from "ethers";

export async function connectWalletAndSign(signMessage) {
	if (typeof window.ethereum !== "undefined") {
		const accounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		});

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const resp = await provider.getSigner().signMessage(signMessage);
		return { provider, resp, address: accounts[0] };
	} else {
		throw Error("Metamask not Found");
	}
}
