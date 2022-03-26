import fetch from "node-fetch";
import { upload } from "../ipfs/index.js";

const api_key = "63e7bbc2-9acd-4134-aa99-4f352458a0f2";
const livepeer = "https://livepeer.com/api";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const createStream = async (name, record = true) => {
	return await fetch(`${livepeer}/stream`, {
		method: "post",
		body: JSON.stringify({
			name: name,
			record: record,
			profiles: [
				{
					name: "720p",
					bitrate: 2000000,
					fps: 30,
					width: 1280,
					height: 720,
				},
				{
					name: "480p",
					bitrate: 1000000,
					fps: 30,
					width: 854,
					height: 480,
				},
				{
					name: "360p",
					bitrate: 500000,
					fps: 30,
					width: 640,
					height: 360,
				},
			],
		}),
		headers: {
			Authorization: `Bearer ${api_key}`,
			"Content-Type": "application/json",
		},
	}).then((resp) => resp.json());
};

export const listStreams = async (active) => {
	const filter = active ? `&filters=[{"id": "isActive", "value": true}]` : "";
	return await fetch(`${livepeer}/stream?streamsonly=1${filter}`, {
		method: "get",
		headers: {
			Authorization: `Bearer ${api_key}`,
		},
	}).then((resp) => resp.json());
};

export const getStream = async (streamID) => {
	return await fetch(`${livepeer}/stream/${streamID}`, {
		method: "get",
		headers: {
			Authorization: `Bearer ${api_key}`,
		},
	}).then((resp) => resp.json());
};

export const listSessions = async (streamID, record = true) => {
	return await fetch(
		`${livepeer}/stream/${streamID}/sessions?record=${record ? 1 : 0}`,
		{
			method: "get",
			headers: {
				Authorization: `Bearer ${api_key}`,
			},
		}
	).then((resp) => resp.json());
};

// ----------------------------------------------------

export const createDirectUploadURL = async (name) => {
	console.log(
		JSON.stringify({
			name: name,
		})
	);
	return await fetch(`${livepeer}/asset/request-upload`, {
		method: "post",
		body: JSON.stringify({
			name: name,
		}),
		headers: {
			Authorization: `Bearer ${api_key}`,
			"Content-Type": "application/json",
		},
	}).then((resp) => resp.json());
};

export const uploadFile = async (fileObj, uploadURL) => {
	return await fetch(uploadURL, {
		method: "put",
		body: fileObj,
		headers: { "Content-Type": "video/mp4" },
	});
};

export const listAssets = async () => {
	return await fetch(`${livepeer}/asset`, {
		method: "get",
		headers: {
			Authorization: `Bearer ${api_key}`,
		},
	}).then((resp) => resp.json());
};

export const getAsset = async (assetID) => {
	return await fetch(`${livepeer}/asset/${assetID}`, {
		method: "get",
		headers: {
			Authorization: `Bearer ${api_key}`,
		},
	}).then((resp) => resp.json());
};

export const listTasks = async () => {
	return await fetch(`${livepeer}/task`, {
		method: "get",
		headers: {
			Authorization: `Bearer ${api_key}`,
		},
	}).then((resp) => resp.json());
};

export const getTask = async (taskID) => {
	return await fetch(`${livepeer}/task/${taskID}`, {
		method: "get",
		headers: {
			Authorization: `Bearer ${api_key}`,
		},
	}).then((resp) => resp.json());
};

// ------------------------------------------------------

export const convertAssetToNFT = async (
	assetID,
	name,
	description,
	thumbnail,
	creator
) => {
	const thumbHash = await upload(thumbnail);
	const nftMetadata = {
		name: name,
		description: description,
		image: `ipfs://${thumbHash}`,
		properties: {
			creator: creator,
		},
	};
	console.log(JSON.stringify(nftMetadata));

	return await fetch(`${livepeer}/asset/${assetID}/export`, {
		method: "post",
		body: JSON.stringify({
			ipfs: {
				nftMetadata,
			},
		}),
		headers: {
			Authorization: `Bearer ${api_key}`,
			"Content-Type": "application/json",
		},
	}).then((resp) => resp.json());
};

// ------------------------------------------------

export const uploadVideo = async (
	name,
	description,
	thumb,
	video,
	creatorId
) => {
	const details = await createDirectUploadURL("test-upload");
	await uploadFile(video, details.url);
	let status = "waiting";
	let res = {};
	while (status === "waiting") {
		await sleep(5000);
		res = await getAsset(details.asset.id);
		status = res.status;
		console.log("video upload status", status);
	}
	if (status !== "ready") {
		throw Error(`failed to upload, error=${JSON.stringify(res)}`);
	}
	console.log("file uploaded...", res);
	const task = await convertAssetToNFT(
		details.asset.id,
		name,
		description,
		thumb,
		creatorId
	);
	status = "progressing";
	while (status !== "completed" && status !== "failed") {
		await sleep(5000);
		res = await getTask(task.task.id);
		status = res.status.phase;
		console.log("nft status", status);
	}
	if (status !== "completed") {
		throw Error(`failed to convert to nft, error=${JSON.stringify(res)}`);
	}
	return res.output.export.ipfs.nftMetadataUrl;
};
