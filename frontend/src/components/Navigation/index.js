import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className="navigation-bar">
      <li className="home-button">
        <NavLink exact to="/">
          Home
        </NavLink>
      </li>
      {isLoaded &&
        <div>
          <div>
            <Link to="/spots/new">Create a New Spot</Link>
          </div>
          <div>
            <li className="profile-button">
              <ProfileButton user={sessionUser} />
            </li>
          </div>
        </div>}
    </ul>
  );
}

export default Navigation;
