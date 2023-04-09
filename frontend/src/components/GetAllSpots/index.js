import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { allSpots, allSpotsThunk, clearSpot } from '../../store/spotsReducer';
import {useEffect} from 'react'


import './GetAllSpots.css'

export default function GetAllSpots() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allSpotsThunk())
    return (() => dispatch(clearSpot()))
  }, [dispatch])

  const spots = useSelector(allSpots)

  const spotsArray = Object.values(spots);
  spotsArray.forEach(spot=> {
    if (spot.avgRating === null || spot.avgRating === "NaN") {
      spot.avgRating = "New"
    }
    else if (spot.avgRating !== "New") {
      spot.avgRating = Number(spot.avgRating).toFixed(1);
    }
  })


  return (
    <>
<<<<<<< HEAD
      <div className='get-all-spots'>
=======
    <div className='get-all-spots-overall-container'>
      <div className='get-all-spots-container'>
>>>>>>> dev
      {spotsArray.map(spot =>  {
        return (
        <div className='get-all-spots-tile'>
          <Link to={`/spots/${spot.id}`} className='get-all-spots-link'>
          <img src={spot.previewImage} alt={`preview`} className='get-all-spots-img-tile'/>
          <div className='get-all-spots-rating-city'>
            <h3 className='get-all-spots-city-state'>{`${spot.city}, ${spot.state}`}</h3>
            <div className='get-all-spots-star-rating'>
              <i class="fa-solid fa-star" /><p className='rating-text'>{`${spot.avgRating}`}</p>
            </div>
          </div>
          <div className='get-all-spots-price-night'>
              <text className='all-spot-price'>{`$${spot.price}`}</text> <text className='night-text'> night</text>
          </div>
          </Link>
        </div>
        )
      })}
      </div>
        <div className='get-all-spots-map-container'>
          GOOGLE MAPS or MAPBOTS API GO HERE
        </div>
      </div>
    </>
  )
}
