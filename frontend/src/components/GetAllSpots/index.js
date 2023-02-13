import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { allSpots, allSpotsThunk } from '../../store/spotsReducer';
import {useEffect} from 'react'


import './GetAllSpots.css'

export default function GetAllSpots() {
  // console.log("get all spots is running");

  const dispatch = useDispatch();
  // async function, useEffect to change state and trigger useSelector
  useEffect(() => {
    // console.log("use effect get all spots thunk dispatching");
    dispatch(allSpotsThunk())
  }, [dispatch])

  // after useEffect, spots
  const spots = useSelector(allSpots)
  // console.log("useselector for state.spots ", spots)

  // change spots to spotsArray for easier iteration
  const spotsArray = Object.values(spots);
  // console.log('change from object to array again', spotsArray);

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
