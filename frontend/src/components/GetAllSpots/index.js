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
    // return dispatch(clearSpot())
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
      <div className='get-all-spots'>
      {spotsArray.map(spot =>  {
        return (
        <div className='spot-tile'>
          <Link to={`/spots/${spot.id}`} className='link-spot-tile'>
          <img src={spot.previewImage} alt={`preview`} className='img-tile'/>
          <div className='rating-city'>
            <h3 className='city-state'>{`${spot.city}, ${spot.state}`}</h3>
            <div className='star-rating'>
              <i class="fa-solid fa-star" /><p className='rating-text'>{`${spot.avgRating}`}</p>
            </div>
          </div>
          <div className='spot-price-night'>
              <text className='all-spot-price'>{`$${spot.price}`}</text> <text className='night-text'> night</text>
          </div>
          </Link>
        </div>
        )
      })}
      </div>
    </>
  )
}
