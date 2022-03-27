import React from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../data/user";
import "./Header.css";

function Popover({ id }) {
	const user = getCurrentUser();
	return (
		<div className="popover">
			<Link to={`/${id}`} className="popover-item">
				Profile
			</Link>
			<Link to="/edit-profile" className="popover-item">
				User Settings
			</Link>
			<Link to="/" className="popover-item">
				Disconnect
			</Link>
		</div>
	);
}

export default Popover;
