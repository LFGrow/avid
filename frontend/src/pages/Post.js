import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import SinglePost from "../components/SinglePost/SinglePost";
import { getPost } from "../data/post";

function Post() {
  const postId = useParams("postId");
  const post = getPost(postId);
  return (
    <div>
      <Header />
      <SinglePost {...post} />
    </div>
  );
}

export default Post;
