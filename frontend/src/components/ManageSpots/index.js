import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { currentSpots, loadCurrentUserSpots, deleteSpotThunk } from "../../store/spotsReducer";
import {Link, Redirect} from 'react-router-dom';
import DeleteConfirmModal from "../DeleteSpot/index";

import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

import "./ManageSpots.css";

export default function ManageSpots()  {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCurrentUserSpots())
  },[dispatch]);

  const current = useSelector(currentSpots);
  // console.log('current spots , ', current);
  const currentSpotImages = Object.values(current);

  const currentSpotsArr = Object.values(current);

  currentSpotsArr.forEach(spot => {
    console.log('spot avg rating in manage spots ' , spot.avgRating)
    if (spot.avgRating === null || spot.avgRating === NaN) {
      spot.avgRating = "New"
    } else if (spot.avgRating !== "New") {
      spot.avgRating = Number(spot.avgRating).toFixed(1);
    }
  })


  return (
    <div className='manage-spots-div'>
      <h1>Manage Your Spots</h1>
      <div className='create-spot-button'>
      <Link to='/spots/new' className='create-spot-link'>Create New Spot</Link>
      </div>
    <div className="spots">
      {currentSpotImages.map(spot => {
        return (
          <div className='spot-tile'>
            <Link to={`/spots/${spot.id}`} className='link-spot-tile'>
              <img src={spot.previewImage} alt={`preview`} className='img-tile'/>
              <div className='rating-city'>
                <h3 className='city-state'>{`${spot.city}, ${spot.state}`}</h3>
                <div className='star-rating'>
                  <i class="fa-solid fa-star"/><p className='rating-text'>{`${spot.avgRating}`}</p>
                </div>
              </div>
              <div className='night-update-delete'>
                <div className='spot-price-night'>
                <h4 className='spot-price-manage'>{`$${spot.price}`}</h4> <h4 className='night'> night</h4>
                </div>
                <div className='update-delete-links'>
                  <div className='button'>
                  <Link to={`/spots/${spot.id}/edit`} className='update-link'><p className='updatelinktext'>Update</p></Link>
                  </div>
                  <div className='button'>
                  <OpenModalMenuItem className='delete-modal' itemText="Delete"
                  modalComponent={<DeleteConfirmModal spotId={spot.id}/>}
                  />
                  </div>
                </div>
              </div>

            </Link>
          </div>

        );
      })}
    </div>
    </div>
  );
}
