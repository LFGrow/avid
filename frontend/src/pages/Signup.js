import React, { useEffect, useState } from "react";
import "./Signup.css";
import { upload } from "../library/ipfs";
import SignupHeader from "../components/SignupHeader/SignupHeader";
import localForage from "localforage";
import { useNavigate } from "react-router-dom";
import { createStream } from "../library/livepeer";
import {
	checkProfileExists,
	createProfile,
	getProfiles,
	updateProfile,
} from "../library/lens";
import { connectWallet } from "../library/web3";
import localforage from "localforage";

function SignUp() {
	// Declare a new state variable, which we'll call "count"
	const [fileName, setFileName] = useState("No file chosen");
	const [avatar, setAvatar] = useState(
		"QmQT8FrcCGLecUouhxXJKUVLyNQh8qHpvBjKKDbc2UhEMw"
	);
	const [address, setAddress] = useState("");
	const [tokens, setTokens] = useState(undefined);

	const navigate = useNavigate();

	useEffect(() => {
		localforage.getItem("userAddress").then((data) => {
			if (data === undefined) {
				navigate("/");
			}
			console.log(data);
			setAddress(data);
		});
		localforage.getItem("tokens").then((data) => {
			if (data === undefined) {
				navigate("/");
			}
			console.log(data);
			setTokens(data);
		});
	}, [address]);

	const uploadFile = async (file) => {
		const res = await upload(file);
		setAvatar(res);
	};

	const createProfileHandler = async (e) => {
		e.preventDefault();
		try {
			console.log("hereR", tokens.accessToken);
			const txHash = await createProfile(
				tokens.accessToken,
				address,
				e.target.handle.value,
				`ipfs://${avatar}`,
				e.target.followFee.value
			);
			console.log(txHash);
			const { provider } = await connectWallet();
			let status = null;
			while (status === null) {
				status = await provider.waitForTransaction(txHash, 1);
				console.log("status", status);
			}
			let profile = await checkProfileExists(address);
			console.log(profile);
			const streamDetails = await createStream(
				e.target.handle.value + profile.id,
				true
			);
			console.log(streamDetails);
			const update = await updateProfile(
				tokens.accessToken,
				profile.id,
				e.target.displayName.value,
				e.target.bio.value,
				e.target.twitterURL.value,
				streamDetails.id
			);
			console.log(update);
			profile = await checkProfileExists(address);
			console.log(profile);
			localforage.setItem("profile", profile);
			navigate("/feed");
		} catch (err) {
			console.log(
				tokens.accessToken,
				address,
				e.target.handle.value,
				`ipfs://${avatar}`,
				e.target.followFee.value,
				err
			);
		}
	};

	return (
		<div className="signupContainer">
			<SignupHeader />
			<div className="signupForm">
				<form onSubmit={createProfileHandler}>
					<img
						className="avatarImage"
						src={`https://ipfs.infura.io/ipfs/${avatar}`}
						alt="Avatar"
					/>
					<br />
					<input
						type="file"
						id="actual-btn"
						onChange={(event) => uploadFile(event.target.files[0])}
						hidden
					/>
					<label htmlFor="actual-btn">Upload Profile Picture</label>
					<br />
					<br />
					<input
						className="inputText"
						type="text"
						id="handle"
						name="handle"
						placeholder="handle"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="displayName"
						name="displayName"
						placeholder="display name"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="bio"
						name="bio"
						placeholder="bio"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="twitterURL"
						name="twitterURL"
						placeholder="twitter url"
					/>
					<br />
					<input
						className="inputText"
						type="number"
						id="followFee"
						name="followFee"
						placeholder="follow fee"
					/>
					<br />
					<input
						className="inputSubmit"
						type="submit"
						value="Create Account"
					/>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
