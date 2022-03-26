import React, { useState } from "react";
import "./CreatePost.css";
import { upload } from "../library/ipfs";
import Header from "../components/Header/Header";

function CreatePost() {
	// Declare a new state variable, which we'll call "count"
	const [fileName, setFileName] = useState("No file chosen");
	const [videoSrc, seVideoSrc] = useState("");

	const handleChange = (file) => {
		console.log(file);
		var url = URL.createObjectURL(file);
		seVideoSrc("");
		seVideoSrc(url);
		console.log(videoSrc);
	};

	return (
		<div className="createPostContainer">
			<Header />
			<div className="createPostForm">
				{videoSrc !== "" && (
					<video key={videoSrc} width="460" height="240" controls>
						<source src={videoSrc} />
					</video>
				)}
				{videoSrc === "" && <div className="emptyVideo"></div>}
				<form>
					<br />
					<input
						type="file"
						id="actual-btn"
						onChange={(event) =>
							handleChange(event.target.files[0])
						}
						hidden
					/>
					<label htmlFor="actual-btn">Upload Video</label>
					<input
						type="file"
						id="thumbail-btn"
						onChange={(event) =>
							handleChange(event.target.files[0])
						}
						hidden
					/>
					<label htmlFor="thumbail-btn">Upload Thumbnail</label>
					<br />
					<br />
					<input
						className="inputText"
						type="text"
						id="collectFee"
						placeholder="collect fee"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="title"
						placeholder="title"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="description"
						placeholder="description"
					/>
					<br />
					<input
						className="inputSubmit"
						type="submit"
						value="Create Post"
					/>
				</form>
			</div>
		</div>
	);
}

export default CreatePost;
