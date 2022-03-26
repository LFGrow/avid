import React from "react";
import Header from "../components/Header/Header";
import SinglePost from "../components/SinglePost/SinglePost";
import { getFeed } from "../data/feed";
import "./CreatePost.css";
function Home() {
	const feed = getFeed();
	return (
		<div className="createPostContainer">
			<Header />
			{feed.map((post) => (
				<SinglePost {...post} />
			))}
		</div>
	);
}

export default Home;
