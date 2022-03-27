import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import Popover from "./Popover.js";
import localForage from "localforage";
import { useNavigate } from "react-router-dom";

function SignupHeader() {
	const [address, setAddress] = useState("");
	const [openMenu, setOpenMenu] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		localForage.getItem("userAddress").then((data) => {
			if (data === undefined) {
				navigate("/");
			}
			console.log(data);
			setAddress(data);
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
			<div className="profile" onClick={() => setOpenMenu(!openMenu)}>
				<div>{address}</div>
				<img
					className="headerAvatar"
					src={`https://avatars.dicebear.com/api/identicon/${address}.svg?scale=60&&backgroundColor=white&translateX=-1&colors[]=amber&colors[]=blue&colors[]=blueGrey&colors[]=deepOrange&colors[]=lightBlue&colors[]=lime&colors[]=yellow&colors[]=red&colorLevel=700`}
					alt="profile image"
				/>
			</div>
			{openMenu && <Popover />}
		</div>
	);
}

export default SignupHeader;
