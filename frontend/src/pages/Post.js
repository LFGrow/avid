import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import { PostSidebar } from "../components/PostSidebar/PostSidebar";
import SinglePost from "../components/SinglePost/SinglePost";
import { getPost } from "../data/post";

function Post() {
	const { postId } = useParams("postId");
	const post = getPost(postId);
	return (
		<div className="postContainer">
			<Header />
			<div className="postContent">
				<SinglePost id={postId} key={postId} />
			</div>
			<PostSidebar userDetails="" />
		</div>
	);
}

export default Post;
