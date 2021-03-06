import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postComment } from "../../data/post";
import "./SinglePost.css";
import { getPublication } from "../../library/lens";

function SinglePost({ id }) {
	const [post, setPost] = useState(undefined);

	useEffect(() => {
		console.log("fdsfdf", id);
		getPublication(id).then((data) => {
			setPost(data);
		});
	}, [id]);
	console.log(post);
	if (post === undefined) {
		return <div className="emptyPost"></div>;
	}
	return (
		<div className="post">
			<div className="card">
				{/* Post Info */}
				<div className="head">
					<div className="poster-details">
						<img
							className="headerAvatar"
							src={`https://ipfs.infura.io/ipfs/${post.profile.picture.original.url.replace(
								"ipfs://",
								""
							)}`}
							alt="profile image"
						/>
						<div>{post.profile.handle}</div>
					</div>
					<img src="/images/menu.png" alt="menu" />
				</div>

				{/* Post */}
				{post.metadata.media[0].original.mimeType.includes("video") ? (
					<video width="640" height="360" controls>
						<source
							src={`${post.metadata.media[0].original.url}#t=0.1`}
							type="video/mp4"
						></source>
					</video>
				) : (
					<img
						src={post.metadata.media[0].original.url}
						alt="post"
						width="640"
						height="360"
					/>
				)}

				{/* Actions */}
				<div className="actions">
					<div className="action-group-1">
						<img src="/images/like.png" alt="like" />
						<img src="/images/comment.png" alt="comment" />
						<img src="/images/share.png" alt="share" />
					</div>
					<div className="action-group-2">
						<img src="/images/bookmark.png" alt="bookmark" />
					</div>
				</div>
				<div className="engagement">
					<div className="like-count">
						{post.stats.totalAmountOfCollects} collects
					</div>
					<div className="top-comment">
						{post.metadata.description}
					</div>
					<div>
						<Link to={`/post/${id}`}>View all 0 comments</Link>
					</div>
				</div>
				{/* Add Comment */}
				<div className="head">
					<div className="poster-details">
						<img src="/images/post-comment.png" alt="emoji" />
						<div contentEditable="true">Add a comment...</div>
					</div>
					<div
						className="post-button"
						onClick={() => postComment(id)}
					>
						Post
					</div>
				</div>
			</div>
		</div>
	);
}

export default SinglePost;
