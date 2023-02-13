import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { allSpots, allSpotsThunk } from '../../store/spotsReducer';
import {useEffect} from 'react'


import './GetAllSpots.css'

function GetAllSpots() {
  console.log("get all spots is running");

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("use effect get all spots thunk dispatching");
    dispatch(allSpotsThunk())
  }, [dispatch])

  const spots = useSelector(state => {return state.spots})
  // console.log("useselector for state.spots ", spots)

  const spotsArray = Object.values(spots);
  // console.log('change from object to array again', spotsArray);

  return (
    <>
      <div className='spots-previewimages'>
      {spotsArray.map(spot =>  {
        return (
        <div>
          <img src={spot.previewImage} alt={`preview`}/>
          <h3>{`${spot.city}, ${spot.state}`}</h3>
          <h4>{`$${spot.price} night`}</h4>
          <div>
          <i class="fa-solid fa-star">{`${spot.avgRating}`}</i>
          {/* <h3></h3> */}
          </div>
        </div>
        )
      })}
      </div>
    </>
  )
}

export default GetAllSpots
