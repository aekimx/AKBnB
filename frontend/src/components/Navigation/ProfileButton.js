import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import {Link, useHistory} from 'react-router-dom'
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';


import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/');
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu} className='profile-button'>
        <div className='profile-button-images'>
        <i className="fa-sharp fa-solid fa-bars" />
        <i className="fas fa-user-circle" />
        </div>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className='logged-in'>
            <div className='logged-in-user-info'>
            <p className='user-info'>Hello, {user.firstName}</p>
            <p className='user-info'>{user.username}</p>
            <p className='user-info'>{user.firstName} {user.lastName}</p>
            <p className='user-info'>{user.email}</p>
            </div>
            {/* NEEDS TO BE A LINE HERE TO SEPARATE */}
            <div className='manage-spots-div'>
            <Link to={`/spots/current`} className='manage-spots'>Manage Spots</Link>
            </div>
            {/* NEEDS TO BE A LINE HERE TO SEPARATE */}
            <div className='logout-button-div'>
              <button className='logout-button' onClick={logout}>Log Out</button>
            </div>

          </div>
        ) : (
          <div className='modal'>
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                className="signUpText"
                modalComponent={<SignupFormModal />}
              />
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              className='logInText'
              modalComponent={<LoginFormModal />}
            />


          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
