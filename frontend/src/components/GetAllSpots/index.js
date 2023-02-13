import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { allSpots, allSpotsThunk } from '../../store/spotsReducer';

import './GetAllSpots.css'

function GetAllSpots() {
  console.log("get all spots is running");
  const dispatch = useDispatch();
  const spots = dispatch(allSpotsThunk())
  console.log('spots from useSelector', spots)


  return (
    <>
      <h1> GET ALL SPOTS </h1>
      {/* <div className='spots-previewimages'>
      {spots.map(spot =>  {
        return <img src={spot.previewImage} alt='preview spot'/>
      })}
      </div> */}
    </>
  )
}

export default GetAllSpots
