import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import { getUserDetails } from "../data/user";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./Profile.css";
import { Video } from "../components/Video/Video";
import { getProfiles, getPublications } from "../library/lens";
import { getStream, listSessions } from "../library/livepeer";

function Profile() {
	const { userId } = useParams("userId");
	const userDetails = getUserDetails("");
	const [selectedTab, setSelectedTab] = useState(1);
	const [live, setLive] = useState(false);
	const [profile, setProfile] = useState(undefined);
	const [posts, setPosts] = useState(undefined);
	const [playback, setPlayback] = useState(undefined);
	const [sessions, setSessions] = useState(undefined);
	const navigate = useNavigate();
	useEffect(() => {
		getProfiles(undefined, [userId]).then((data) => {
			if (data.length === 0) {
				navigate("/feed");
			}
			setProfile(data[0]);
			getPublications(userId, ["POST"]).then((posts) => {
				setPosts(
					posts.filter(
						(post) =>
							post.id !== "0x0408-0x06" &&
							post.id !== "0x0408-0x01"
					)
				);
			});
			listSessions(data[0].website, true).then(setSessions);
		});
	}, [userId]);

	useEffect(() => {
		if (profile !== undefined) {
			const id = setInterval(async () => {
				const stream = await getStream(profile.website);
				console.log("stream", stream);
				if (stream.isActive) {
					setLive(true);
				} else {
					setLive(false);
				}
				setPlayback(stream.playbackId);
			}, 5000);
			return () => clearInterval(id);
		}
	}, [profile]);

	console.log(posts, sessions);
	return (
		<div className="profileContainer">
			<Header />
			<div className="profileSec">
				{profile === undefined && (
					<div className="user-info">
						<div>
							<img
								className="dp"
								src={userDetails.dp}
								alt="profile picture"
							/>
							{live && <button className="live">LIVE</button>}
						</div>
						<div className="details">
							<div className="username-follow">
								<div className="handle">@vitalik</div>
								<button className="follow">Follow</button>
							</div>
							<div className="stats">
								<div className="stat">1,258 posts</div>
								<div className="stat">4M followers</div>
								<div className="stat">1,250 following</div>
							</div>
							<div className="bio">Vitalik Buterin bioooooo</div>
						</div>
					</div>
				)}
				{profile !== undefined && (
					<div className="user-info">
						<div>
							<img
								className="dp"
								src={`https://ipfs.infura.io/ipfs/${profile.picture.original.url.replace(
									"ipfs://",
									""
								)}`}
								alt="profile picture"
							/>
							{live && (
								<button
									className="live"
									onClick={() =>
										window
											.open(
												`https://www.hlsplayer.net/#type=m3u8&src=https://cdn.livepeer.com/hls/${playback}/index.m3u8`,
												"_blank"
											)
											.focus()
									}
								>
									LIVE
								</button>
							)}
						</div>
						<div className="details">
							<div className="username-follow">
								<div className="handle">{profile.handle}</div>
								<button className="follow">Follow</button>
							</div>
							<div className="stats">
								<div className="stat">
									{profile.handle.includes("gdsoumya")
										? profile.stats.totalPosts - 2
										: profile.stats.totalPosts}{" "}
									posts
								</div>
								<div className="stat">
									{profile.stats.totalFollowers} followers
								</div>
								<div className="stat">
									{profile.stats.totalFollowing} following
								</div>
							</div>
							<div className="bio">{profile.bio}</div>
						</div>
					</div>
				)}
				<div className="tabs">
					<div
						className={selectedTab == 1 ? "tab-selected" : "tab"}
						onClick={() => setSelectedTab(1)}
					>
						VIDEOS
					</div>
					<div
						className={selectedTab == 2 ? "tab-selected" : "tab"}
						onClick={() => setSelectedTab(2)}
					>
						STREAMS
					</div>
				</div>
				{selectedTab == 1 && posts === undefined && (
					<div className="emptyPosts"></div>
				)}
				{selectedTab == 1 && posts !== undefined && (
					<div className="posts">
						{posts.map((post) => (
							<Video
								srcURL={post.metadata.media[0].original.url}
								redirectURL={`/post/${post.id}`}
							/>
						))}
					</div>
				)}
				{selectedTab == 2 && sessions === undefined && (
					<div className="emptyPosts"></div>
				)}
				{selectedTab == 2 && sessions !== undefined && (
					<div className="posts">
						{sessions.map(
							(post) =>
								post.mp4Url !== undefined && (
									<Video
										srcURL={post.mp4Url}
										redirectURL={`/live-recording${post.mp4Url
											.replace(
												"https://cdn.livepeer.com/recordings",
												""
											)
											.replace("/source.mp4", "")}`}
									/>
								)
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default Profile;
