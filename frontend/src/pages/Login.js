import React from "react";
import "./Login.css";
import avid from "./avid.svg";
import { connectWalletAndSign } from "../library/web3";
function Login() {
	const login = async () => {
		const data = await connectWalletAndSign("test message");
	};

	return (
		<div className="loginContainer">
			<div className="branding">
				<img className="logo" src={avid} />
				<h2 className="branding1">
					Web3 Native Instagram for Creators
				</h2>
				<h2 className="branding2">
					Own your content.
					<br /> Login with Web3, get paid and use decentralized
					storage.
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
