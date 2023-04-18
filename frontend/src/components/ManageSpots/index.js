import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { currentSpots, loadCurrentUserSpots, deleteSpotThunk, clearSpot } from "../../store/spotsReducer";
import {Link, Redirect} from 'react-router-dom';
import DeleteConfirmModal from "../DeleteSpot/index";

import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

import "./ManageSpots.css";

export default function ManageSpots()  {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSpot());
    dispatch(loadCurrentUserSpots())
    return (() => dispatch(clearSpot()))
  },[dispatch]);

  const current = useSelector(currentSpots);
  const currentSpotImages = Object.values(current);

  const currentSpotsArr = Object.values(current);

  currentSpotsArr.forEach(spot => {
    if (spot.avgRating === null || spot.avgRating === NaN) {
      spot.avgRating = "New"
    } else if (spot.avgRating !== "New") {
      spot.avgRating = Number(spot.avgRating).toFixed(1);
    }
  })


  return (
    <div className='manage-spots-div-bigger'>
      <div className='manage-spots-text'>Manage Your Spots</div>
      <div className='manage-spots-create-spot-button'>
      <Link to='/spots/new' className='manage-spots-create-spot-link'>Create New Spot</Link>
      </div>
    <div className="manage-spots-container">
      {currentSpotImages.map(spot => {
        return (
          <div className='manage-spots-tile'>
            <Link to={`/spots/${spot.id}`} className='manage-spots-link-spot-tile'>
              <img src={spot.previewImage} alt={`preview`} className='manage-spots-img-tile'/>
              <div className='manage-spots-rating-city-container'>
                <div className='manage-spots-city-state'>{`${spot.city}, ${spot.state}`}</div>
                <div className='manage-spots-star-rating'>
                  <i class="fa-solid fa-star"/><p className='rating-text'>{`${spot.avgRating}`}</p>
                </div>
              </div>

            </Link>
              <div className='manage-spots-night-update-delete-container'>
                <div className='manage-spots-price-night'>
                  <div className='spot-price-manage'>{`$${spot.price}`}</div> <div className='manage-spots-night'> night</div>
                </div>

                <div className='manage-spots-update-delete-links'>

                  <div className='manage-spots-delete-button'>
                    <Link to={`/spots/${spot.id}/edit`} className='manage-spots-update-link'><p className='manage-spots-updatelinktext'>Update</p></Link>
                  </div>

                  <div className='manage-spots-delete-button'>
                    <OpenModalMenuItem className='delete-modal' itemText="Delete"
                    modalComponent={<DeleteConfirmModal spotId={spot.id}/>}
                    />
                  </div>

                </div>

              </div>


          </div>

        );
      })}
    </div>
    </div>
  );
}
