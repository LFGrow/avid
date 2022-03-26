import React from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../data/user";
import "./Header.css";

function Popover() {
	const user = getCurrentUser();
	return (
		<div className="popover">
			<p className="popover-item" onClick={() => console.log("logout")}>
				Disconnect
			</p>
		</div>
	);
}

export default Popover;
