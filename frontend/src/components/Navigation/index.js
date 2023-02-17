import React from "react";
import { NavLink, Link, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
// import logo from '../../assets/logo'


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className="navigation-bar">
      <li className="home-button">
        <div className='logo-container'>
          <NavLink exact to="/" className='navlink-home'><i class="fa-regular fa-sun" /><p className='logo-text' >AKBnB</p></NavLink>

          </div>
      </li>
      {isLoaded &&
        <div className='loggedin-container'>
          <div>
            {!sessionUser ? null :
            <div className='create-spot-link-container'>
              <Link to="/spots/new" className='create-spot-link'>Create a New Spot</Link>
            </div>}
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
