import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import { getUserDetails } from "../data/user";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./Profile.css";
import { Video } from "../components/Video/Video";

function Profile() {
	const userId = useParams("userId");
	const userDetails = getUserDetails(userId);
	const [selectedTab, setSelectedTab] = useState(1);
	return (
		<div className="profileContainer">
			<Header />
			<div className="profileSec">
				<div className="user-info">
					<div>
						<img
							className="dp"
							src={userDetails.dp}
							alt="profile picture"
						/>
						<button className="live">LIVE</button>
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
						<div className="name">Vitalik Buterin</div>
					</div>
				</div>
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
				<div className="posts">
					{userDetails.videos.map((post) => (
						<Video srcURL={post} redirectURL="/post/123342" />
					))}
				</div>
			</div>
		</div>
	);
}

export default Profile;
