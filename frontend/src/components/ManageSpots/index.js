import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { currentSpots, loadCurrentUserSpots, deleteSpotThunk } from "../../store/spotsReducer";
import {Link, Redirect} from 'react-router-dom';
import DeleteConfirmModal from "../DeleteSpot";

import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

import "./ManageSpots.css";

export default function ManageSpots()  {

  // const userId = useSelector((state) => state.session.user.id)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCurrentUserSpots())
  },[dispatch]);

  const current = useSelector(currentSpots);
  // console.log('current from useselector in manage spots' , current);
  const currentSpotImages = Object.values(current);

  const currentSpotsArr = Object.values(current);

  // console.log('currentSpotsArr for avgStarrating fix', currentSpotsArr)

  currentSpotsArr.forEach(spot => {
    if (spot.avgRating === null) {
      spot.avgRating = "New"
    }
  })


  return (
    <div>
      <h1>Manage Your Spots</h1>
      <Link to='/spots/new'>Create New Spot</Link>
    <div className="manage-spots">
      {currentSpotImages.map(spot => {
        return (
          <div>
            <Link to={`/spots/${spot.id}`}>
              <img src={spot.previewImage} alt={`preview`} />
              <h3>{`${spot.city}, ${spot.state}`}</h3>
              <h4>{`$${spot.price} night`}</h4>
              <div>
                <i class="fa-solid fa-star">{`${spot.avgRating}`}</i>
                <Link to={`/spots/${spot.id}/edit`}>Update</Link>
                <OpenModalMenuItem itemText="Delete"
                modalComponent={<DeleteConfirmModal spotId={spot.id}/>}
                />
              </div>
            </Link>
          </div>
        );
      })}
    </div>
    </div>
  );
}
