import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { allSpots, allSpotsThunk } from '../../store/spotsReducer';
import {useEffect} from 'react'


import './GetAllSpots.css'

export default function GetAllSpots() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allSpotsThunk())
  }, [dispatch])

  const spots = useSelector(allSpots)

  const spotsArray = Object.values(spots);
  spotsArray.forEach(spot=> {
    if (spot.avgRating === null) {
      spot.avgRating = "New"
    }
  })

  return (
    <>
      <div className='spots'>
      {spotsArray.map(spot =>  {
        return (
        <div>
          <Link to={`/spots/${spot.id}`}>
          <img src={spot.previewImage} alt={`preview`}/>
          <h3>{`${spot.city}, ${spot.state}`}</h3>
          <h4>{`$${spot.price} night`}</h4>
          <div>
          <i class="fa-solid fa-star">{`${spot.avgRating}`}</i>
          </div>
          </Link>
        </div>
        )
      })}
      </div>
    </>
  )
}
