import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Video.css";

export function Video({ srcURL, redirectURL }) {
	return (
		<Link to={redirectURL} className="videoCard">
			<video preload="metadata">
				<source src={`${srcURL}#t=0.1`} type="video/mp4" />
			</video>
		</Link>
	);
}
