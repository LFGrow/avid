import React from "react";
import { Link } from "react-router-dom";
import { postComment } from "../../data/post";
import "./SinglePost.css";

function SinglePost(props) {
	return (
		<div className="post">
			<div className="card">
				{/* Post Info */}
				<div className="head">
					<div className="poster-details">
						<img
							className="headerAvatar"
							src={props.user.dp}
							alt="profile image"
						/>
						<div>@{props.user.id}</div>
					</div>
					<img src="/images/menu.png" alt="menu" />
				</div>

				{/* Post */}
				{props.post.type === "video" ? (
					<video width="640" height="360" controls>
						<source src={props.post.uri} type="video/mp4"></source>
					</video>
				) : (
					<img
						src={props.post.uri}
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
					<div className="like-count">{props.likes} collects</div>
					<div className="top-comment">
						{props.topComment.userid} {props.topComment.comment}
					</div>
					<div>
						<Link to={`/post/${props.post.id}`}>
							View all 100 comments
						</Link>
					</div>
				</div>
				{/* Add Comment */}
				<div className="head">
					<div className="poster-details">
						<img src="/images/post-comment.png" alt="emoji" />
						<div>Add a comment...</div>
					</div>
					<div
						className="post-button"
						onClick={() => postComment(props.post.id)}
					>
						Post
					</div>
				</div>
			</div>
		</div>
	);
}

export default SinglePost;
