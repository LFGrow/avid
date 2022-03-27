import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import LiveRecord from "../components/LiveRecord/SinglePost";
import { PostSidebar } from "../components/PostSidebar/PostSidebar";
import SinglePost from "../components/SinglePost/SinglePost";
import { getPost } from "../data/post";

function LiveRecordPage() {
	const { postId } = useParams("postId");
	return (
		<div className="postContainer">
			<Header />
			<div className="postContent">
				<LiveRecord id={postId} key={postId} />
			</div>
			<PostSidebar userDetails="" />
		</div>
	);
}

export default LiveRecordPage;
