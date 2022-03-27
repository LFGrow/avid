import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import { upload } from "../library/ipfs";
import Header from "../components/Header/Header";
import { uploadVideo } from "../library/livepeer";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";
import { createPost, pollUntilIndexed } from "../library/lens";
import { connectWallet, lensHub, signedTypeData } from "../library/web3";
import { splitSignature } from "ethers/lib/utils";
import { BigNumber, utils } from "ethers";

function CreatePost() {
	// Declare a new state variable, which we'll call "count"
	const [fileName, setFileName] = useState("No file chosen");
	const [videoSrc, seVideoSrc] = useState("");
	const [profile, setProfile] = useState({
		id: "12232",
		name: "",
		picture: {
			original: {
				url: "ipfs://QmQT8FrcCGLecUouhxXJKUVLyNQh8qHpvBjKKDbc2UhEMw",
			},
		},
	});
	const [tokens, setTokens] = useState(undefined);
	const navigate = useNavigate();
	useEffect(() => {
		console.log("here");
		localforage.getItem("profile").then((data) => {
			if (data === undefined) {
				navigate("/");
			}
			console.log(data);
			setProfile(data);
		});
		localforage.getItem("tokens").then((data) => {
			if (data === undefined) {
				navigate("/");
			}
			console.log(data);
			setTokens(data);
		});
	}, []);

	const handleChange = (file) => {
		console.log(file);
		var url = URL.createObjectURL(file);
		seVideoSrc("");
		seVideoSrc(url);
		console.log(videoSrc);
	};

	const createPostHandler = async (e) => {
		e.preventDefault();
		try {
			const provider = await connectWallet();
			console.log(e.target.thumbnail, e.target.video);
			const resp = await uploadVideo(
				e.target.title.value,
				e.target.description.value,
				e.target.thumbnail.files[0],
				e.target.video.files[0],
				profile.id
			);
			console.log(resp);

			const data = await createPost(
				tokens.accessToken,
				profile.id,
				provider.address,
				resp,
				e.target.collectFee.value
			);
			console.log(data);
			const signature = await signedTypeData(
				provider.provider,
				data.domain,
				data.types,
				data.value
			);
			console.log(signature);
			const { v, r, s } = splitSignature(signature);
			const tx = await lensHub(provider.provider).postWithSig({
				profileId: data.value.profileId,
				contentURI: data.value.contentURI,
				collectModule: data.value.collectModule,
				collectModuleData: data.value.collectModuleData,
				referenceModule: data.value.referenceModule,
				referenceModuleData: data.value.referenceModuleData,
				sig: {
					v,
					r,
					s,
					deadline: data.value.deadline,
				},
			});
			console.log(tx.hash);
			const indexedResult = await pollUntilIndexed(
				tokens.accessToken,
				tx.hash
			);
			const logs = indexedResult.txReceipt.logs;

			console.log("create post: logs", logs);

			const topicId = utils.id(
				"PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)"
			);
			console.log("topicid we care about", topicId);

			const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
			console.log("create post: created log", profileCreatedLog);

			let profileCreatedEventLog = profileCreatedLog.topics;
			console.log(
				"create post: created event logs",
				profileCreatedEventLog
			);

			const publicationId = utils.defaultAbiCoder.decode(
				["uint256"],
				profileCreatedEventLog[2]
			)[0];

			navigate(
				`/post/${
					data.value.profileId +
					"-" +
					BigNumber.from(publicationId).toHexString()
				}`
			);
		} catch (err) {
			console.log(err);
		}
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
				<form onSubmit={createPostHandler}>
					<br />
					<input
						type="file"
						id="actual-btn"
						name="video"
						onChange={(event) =>
							handleChange(event.target.files[0])
						}
						hidden
					/>
					<label htmlFor="actual-btn">Upload Video</label>
					<input
						type="file"
						id="thumbail-btn"
						name="thumbnail"
						hidden
					/>
					<label htmlFor="thumbail-btn">Upload Thumbnail</label>
					<br />
					<br />
					<input
						className="inputText"
						type="text"
						id="collectFee"
						name="collectFee"
						placeholder="collect fee"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="title"
						name="title"
						placeholder="title"
					/>
					<br />
					<input
						className="inputText"
						type="text"
						id="description"
						name="description"
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
