import React from "react";
import { Link } from "react-router-dom";
import { getProfileInfo } from "../../data/profile.js";
import "./Header.css";

function Header() {
  const { userid, name, dp } = getProfileInfo();

  return (
    <div className="header">
      <img src="./images/logo.png" alt="logo" width={128} />
      <div className="searchbar">
        <input className="search" type="search" placeholder="Search"></input>
      </div>
      <div className="icons">
        <Link to="/">
          <img src="./images/home.png" alt="logo" width={24} />
        </Link>
        <Link to={`/${userid}/create-post`}>
          <img src="./images/create-post.png" alt="logo" width={24} />
        </Link>
        <Link to={`/${userid}`}>
          <img src="./images/profile.png" alt="logo" width={24} />
        </Link>
      </div>
      <div className="profile">
        <div>{name}</div>
        <img src={dp} alt="profile image" />
      </div>
    </div>
  );
}

export default Header;
