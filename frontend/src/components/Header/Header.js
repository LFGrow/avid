import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getProfileInfo } from "../../data/profile.js";
import "./Header.css";
import Popover from "./Popover.js";

function Header() {
	const { userid, name, dp } = getProfileInfo();
	const [openMenu, setOpenMenu] = useState(false);

	return (
		<div className="header">
			<Link to="/">
				<img className="brandLogo" src="/images/logo.png" alt="logo" width={128} />
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
				<Link to={`/${userid}`}>
					<img src="/images/profile.png" alt="logo" width={24} />
				</Link>
			</div>
			<div className="profile" onClick={() => setOpenMenu(!openMenu)}>
				<div>{name}</div>
				<img className="headerAvatar" src={dp} alt="profile image" />
			</div>
			{openMenu && <Popover />}
		</div>
	);
}

export default Header;
