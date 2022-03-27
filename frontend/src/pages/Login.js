import React from "react";
import "./Login.css";
import avid from "./avid.svg";
import { connectWallet, signMessage } from "../library/web3";
import {
	checkProfileExists,
	getChallenge,
	getProfiles,
	getTokens,
} from "../library/lens";
import localForage from "localforage";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();
	const login = async () => {
		const data = await connectWallet();
		const challenge = await getChallenge(data.address);
		console.log(challenge);
		const resp = await signMessage(data.provider, challenge);
		const tokens = await getTokens(data.address, resp);
		console.log(tokens);
		await localForage.setItem("userAddress", data.address);
		await localForage.setItem("tokens", tokens);
		const profile = await checkProfileExists(data.address);
		if (profile === undefined) {
			navigate("/signup");
		} else {
			localForage.setItem("profile", profile);
			navigate("/feed");
		}
	};

	return (
		<div className="loginContainer">
			<div className="branding">
				<img className="logo" src={avid} />
				<h2 className="branding1">The future of creative ownership</h2>
				<h2 className="branding2">
					Join us! <br />
					Be part of the open ecosystem <br />
					Build your brand, share and invest in Web3
				</h2>
			</div>
			<div className="connect">
				<div className="buttons">
					<button className="button1" onClick={login}>
						Sign Up
					</button>
					<button className="button2" onClick={login}>
						Login
					</button>
				</div>
			</div>
		</div>
	);
}

export default Login;
