import localforage from "localforage";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfileInfo } from "../../data/profile";
import "./PostSidebar.css";

export function PostSidebar({ userDetails }) {
	const { userid, name, dp } = getProfileInfo();
	const [profile, setProfile] = useState({
		id: "12232",
		name: "",
		picture: {
			original: {
				url: "ipfs://QmQT8FrcCGLecUouhxXJKUVLyNQh8qHpvBjKKDbc2UhEMw",
			},
		},
	});
	const [openMenu, setOpenMenu] = useState(false);
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
	}, []);
	return (
		<div className="sideBarContainer">
			<div className="currentUser">
				<img
					className="sidebarDp"
					src={
						`https://ipfs.infura.io/ipfs/${profile.picture.original.url.replace(
							"ipfs://",
							""
						)}` || dp
					}
					alt="profile picture"
				/>
				<div className="sidebarDetails">
					<div className="sidebarHandle">{profile.handle || ""}</div>
					<div className="sidebarName">{profile.name || ""}</div>
				</div>
			</div>
			<div className="suggestionLabel">Suggestions For You</div>
			<div className="suggestions">
				<div className="suggestion">
					<div className="suggestionDpName">
						<img
							className="suggestionDp"
							src="https://avatars.dicebear.com/api/identicon/vitalik.svg?scale=60&&backgroundColor=white&translateX=-1&colors[]=amber&colors[]=blue&colors[]=blueGrey&colors[]=deepOrange&colors[]=lightBlue&colors[]=lime&colors[]=yellow&colors[]=red&colorLevel=700"
							alt="profile picture"
						/>
						<div className="suggestionHandle">@vitalik.avid</div>
					</div>
					<div className="suggestionFollow">Follow</div>
				</div>
				<div className="suggestion">
					<div className="suggestionDpName">
						<img
							className="suggestionDp"
							src="https://avatars.dicebear.com/api/identicon/blocky.svg?scale=60&&backgroundColor=white&translateX=-1&colors[]=amber&colors[]=blue&colors[]=blueGrey&colors[]=deepOrange&colors[]=lightBlue&colors[]=lime&colors[]=yellow&colors[]=red&colorLevel=700"
							alt="profile picture"
						/>
						<div className="suggestionHandle">@blocky.avid</div>
					</div>
					<div className="suggestionFollow">Follow</div>
				</div>
				<div className="suggestion">
					<div className="suggestionDpName">
						<img
							className="suggestionDp"
							src="https://avatars.dicebear.com/api/identicon/tester.svg?scale=60&&backgroundColor=white&translateX=-1&colors[]=amber&colors[]=blue&colors[]=blueGrey&colors[]=deepOrange&colors[]=lightBlue&colors[]=lime&colors[]=yellow&colors[]=red&colorLevel=700"
							alt="profile picture"
						/>
						<div className="suggestionHandle">@tester.avid</div>
					</div>
					<div className="suggestionFollow">Follow</div>
				</div>
				<div className="suggestion">
					<div className="suggestionDpName">
						<img
							className="suggestionDp"
							src="https://avatars.dicebear.com/api/identicon/world.svg?scale=60&&backgroundColor=white&translateX=-1&colors[]=amber&colors[]=blue&colors[]=blueGrey&colors[]=deepOrange&colors[]=lightBlue&colors[]=lime&colors[]=yellow&colors[]=red&colorLevel=700"
							alt="profile picture"
						/>
						<div className="suggestionHandle">@world.avid</div>
					</div>
					<div className="suggestionFollow">Follow</div>
				</div>
				<div className="suggestion">
					<div className="suggestionDpName">
						<img
							className="suggestionDp"
							src="https://avatars.dicebear.com/api/identicon/wgmi.svg?scale=60&&backgroundColor=white&translateX=-1&colors[]=amber&colors[]=blue&colors[]=blueGrey&colors[]=deepOrange&colors[]=lightBlue&colors[]=lime&colors[]=yellow&colors[]=red&colorLevel=700"
							alt="profile picture"
						/>
						<div className="suggestionHandle">@wgmi.avid</div>
					</div>
					<div className="suggestionFollow">Follow</div>
				</div>
			</div>
		</div>
	);
}
