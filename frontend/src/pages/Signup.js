import React, { useState } from "react";
import "./Signup.css";
import avid from "./avid.svg";
import { upload } from "../library/ipfs";
import SignupHeader from "../components/SignupHeader/SignupHeader";
function SignUp() {
	// Declare a new state variable, which we'll call "count"
	const [fileName, setFileName] = useState("No file chosen");
	const [avatar, setAvatar] = useState(
		"QmQT8FrcCGLecUouhxXJKUVLyNQh8qHpvBjKKDbc2UhEMw"
	);

	const uploadFile = async (file) => {
		const res = await upload(file);
		setAvatar(res);
	};

	return (
		<div className="signupContainer">
			<SignupHeader />
			<div className="signupForm">
				<form>
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
						placeholder="handle"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="displayName"
						placeholder="display name"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="bio"
						placeholder="bio"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="twitterURL"
						placeholder="twitter url"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="followFee"
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
