import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getProfileInfo } from "../../data/profile.js";
import "./Header.css";
import Popover from "./Popover.js";

function SignupHeader() {
	const { userid, name, dp } = getProfileInfo();
	const [openMenu, setOpenMenu] = useState(false);

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
			<div className="profile" onClick={() => setOpenMenu(!openMenu)}>
				<div>{name}</div>
				<img className="headerAvatar" src={dp} alt="profile image" />
			</div>
			{openMenu && <Popover />}
		</div>
	);
}

export default SignupHeader;
