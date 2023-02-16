import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { oneSpot, oneSpotThunk } from "../../store/spotsReducer";
import UpdateSpot from "./index"

export default function UpdateSpotInfo() {
  let {spotId} = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(oneSpotThunk(spotId))
  }, [dispatch, spotId])

  let spot = useSelector(oneSpot);

  if (spot.name) {
    return (<UpdateSpot spot={spot}/>)
  } else {
    return (<h1>DOESNT WORK</h1>)
  }

}
