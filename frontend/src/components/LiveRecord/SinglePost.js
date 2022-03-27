import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postComment } from "../../data/post";
import "./SinglePost.css";
import { getPublication } from "../../library/lens";
import localforage from "localforage";

function LiveRecord({ id }) {
	const [post, setPost] = useState(undefined);
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
	}, []);
	if (profile === undefined) {
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
							src={`https://ipfs.infura.io/ipfs/${profile.picture.original.url.replace(
								"ipfs://",
								""
							)}`}
							alt="profile image"
						/>
						<div>{profile.handle}</div>
					</div>
					<img src="/images/menu.png" alt="menu" />
				</div>

				{/* Post */}
				<video width="640" height="360" controls>
						<source
							src={`https://cdn.livepeer.com/recordings/${id}/source.mp4#t=0.1`}
							type="video/mp4"
						></source>
					</video>
				

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
					<div className="like-count">0 collects</div>
					<div className="top-comment">
						Live Stream
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

export default LiveRecord;
