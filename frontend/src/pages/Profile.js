import React from "react";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../data/user";

function Profile() {
  const userId = useParams("userId");
  const userDetails = getUserDetails(userId);

  return (
    <div className="container">
      <div className="profile">
        <div className="user-info">
          <img className="dp" src={userDetails.dp} alt="profile picture" />
          <div>userid</div>
          <div>stats</div>
          <div>name</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
