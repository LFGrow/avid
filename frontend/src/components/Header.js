import React from "react";
import { getProfileInfo } from "../data/profile.js";
import "./Header.css";

function Header() {
  const { name, logo } = getProfileInfo();

  return (
    <div className="header">
      <img src="./images/logo.png" alt="logo" width={128} />
      <div className="searchbar">
        <input className="search" type="search" placeholder="Search"></input>
      </div>
      <div className="icons">
        <img src="./images/home.png" alt="logo" width={24} />
        <img src="./images/create-post.png" alt="logo" width={24} />
        <img src="./images/profile.png" alt="logo" width={24} />
      </div>
      <div className="profile">
        <div>{name}</div>
        <img src={logo} alt="profile image" />
      </div>
    </div>
  );
}

export default Header;
