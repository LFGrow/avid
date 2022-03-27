import localforage from "localforage";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import { PostSidebar } from "../components/PostSidebar/PostSidebar";
import SinglePost from "../components/SinglePost/SinglePost";
import { getFeed } from "../data/feed";
import { getTimeline } from "../library/lens";
import "./Home.css";
function Home() {
	const feed = getFeed();
	const [posts, setPosts] = useState([undefined, undefined]);

	const [profile, setProfile] = useState({
		id: "12232",
		name: "",
		picture: {
			original: {
				url: "ipfs://QmQT8FrcCGLecUouhxXJKUVLyNQh8qHpvBjKKDbc2UhEMw",
			},
		},
	});
	const [tokens, setTokens] = useState(undefined);
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
		localforage.getItem("tokens").then((data) => {
			if (data === undefined) {
				navigate("/");
			}
			console.log(data);
			setTokens(data);
		});
	}, []);

	useEffect(() => {
		if (tokens !== undefined)
			getTimeline(tokens.accessToken, profile.id).then((data) => {
				setPosts(
					data.filter(
						(d) => d.__typename === "Post" && d.id !== "0x0408-0x06" && d.id!=="0x0408-0x01"
					)
				);
			});
	}, [tokens]);

	return (
		<div className="postContainer">
			<Header />
			<div className="postContent">
				{posts.map((post) => (
					<SinglePost {...post} />
				))}
			</div>
			<PostSidebar userDetails="hello" />
		</div>
	);
}

export default Home;
