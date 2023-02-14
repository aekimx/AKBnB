import React from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { oneSpotThunk, oneSpot } from "../../store/spotsReducer";

import "./SpotDetails.css";

export default function GetSpotDetails() {
  const dispatch = useDispatch();
  const id = useParams();
  // console.log("id from useparams spotdetails: ", id)

  useEffect(() => {
      // console.log("use effect get one spots thunk dispatching in spotdetails index");
      dispatch(oneSpotThunk(id.spotId));
    },
    [id]
  );

  const spot = useSelector(oneSpot(id.spotId));
  // console.log( "Spot from useselector allspots.id spotdetails ",spot.spotImages);

  const spotImagesArr = spot.spotImages;
  if (!spotImagesArr) return null;

  // console.log('spot images array', spotImages);

  return (
    <div>
      <div className="spot-detail-container">
        <h1>
          {spot.name}
        </h1>
        <h4>
          {spot.city}, {spot.state}, {spot.country}{" "}
        </h4>

        <div>
          {spotImagesArr.map(imageURL => {
            return <img src={`${imageURL}`} alt="image" />;
          })}
        </div>
        <div>
          <h3>
            Hosted by {`${spot.Owner.firstName} ${spot.Owner.lastName}`}
          </h3>
          <h4>{`${spot.description}`}</h4>
        </div>
        <div className="reservation-price-rating-div">
          <div>{`${spot.price} night`}</div>
          <div>
            <i class="fa-solid fa-star">{`${spot.avgStarRating}`}</i>
          </div>
          <div>{`${spot.numReviews} reviews`}</div>
          <button>Reserve</button>
        </div>
      </div>
      <div className='!!!!!INCLUDE REVIEWS HERE!!!!!!!'>
        {/* <Reviews /> */}
        <div>
          <i class="fa-solid fa-star">{`${spot.avgStarRating}`}</i>
          <div>{`${spot.numReviews} reviews`}</div>
        </div>

      </div>
    </div>
  );
}
