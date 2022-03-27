import React from "react";
import { getCurrentUser } from "../../data/user";
import "./Header.css";
import localForage from "localforage";
import { useNavigate } from "react-router-dom";

function Popover() {
	const user = getCurrentUser();
	const navigate = useNavigate();
	return (
		<div className="popover">
			<p
				className="popover-item"
				onClick={() => {
					localForage.setItem("userAddress", "");
					navigate("/");
				}}
			>
				Disconnect
			</p>
		</div>
	);
}

export default Popover;
