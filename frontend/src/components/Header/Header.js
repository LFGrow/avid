import localforage from "localforage";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import Popover from "./Popover.js";

function Header() {
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
		<div className="header">
			<Link to="/">
				<img
					className="brandLogo"
					src="/images/logo.png"
					alt="logo"
					width={128}
				/>
			</Link>
			<div className="searchbar">
				<input
					className="search"
					type="search"
					placeholder="Search"
				></input>
			</div>
			<div className="icons">
				<Link to="/">
					<img src="/images/home.png" alt="logo" width={24} />
				</Link>
				<Link to={`/post/create`}>
					<img src="/images/create-post.png" alt="logo" width={24} />
				</Link>
				<Link to={`/${profile.id}`}>
					<img src="/images/profile.png" alt="logo" width={24} />
				</Link>
			</div>
			<div className="profile" onClick={() => setOpenMenu(!openMenu)}>
				<div>{profile.name}</div>
				<img
					className="headerAvatar"
					src={`https://ipfs.infura.io/ipfs/${profile.picture.original.url.replace(
						"ipfs://",
						""
					)}`}
					alt="profile image"
				/>
			</div>
			{openMenu && <Popover id={profile.id} />}
		</div>
	);
}

export default Header;
