import React from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { oneSpotThunk, oneSpot } from "../../store/spotsReducer";
import CreateReview from "../CreateReview";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { loadReviewsThunk, allReviews } from "../../store/reviewsReducer";

import "./SpotDetails.css";

export default function GetSpotDetails() {
  const dispatch = useDispatch();
  const {spotId}= useParams();

  const userId = useSelector(state => state.session.user.id)


  useEffect(() => {
      // console.log("use effect get one spots thunk dispatching in spotdetails index");
      dispatch(oneSpotThunk(spotId));
      dispatch(loadReviewsThunk(spotId));
    }, [spotId]);

  const spot = useSelector(oneSpot);
  const reviews = useSelector(allReviews)
  console.log('reviews from useslector in spotdetails ', reviews);

  if (!spot.name) {
    return (
      <h1>Unable to retrieve details. Please try again shortly.</h1>
    )
  }

  // NEED TO WORK
  // console.log('spot.avg star rating in spot details', spot.avgStarRating)
  if (spot.avgStarRating === null) spot.avgStarRating = "New";


  const spotImagesArr = spot.spotImages;
  if (!spotImagesArr) return null;

  const reviewInfo = {spotId: spot.id, userId}

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
          {spotImagesArr.map(image => {
            return <img src={`${image.url}`} alt="image" />;
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
          <div> {spot.numReviews} {spot.numReview === 1 ? 'review' : 'reviews'}</div>
          <button>Reserve</button>
        </div>
      </div>
      <div className='!!!!!INCLUDE REVIEWS HERE!!!!!!!'>
        {/* <Reviews /> */}
        <div>
          <i class="fa-solid fa-star">{`${spot.avgStarRating}`}</i>
          <div> {spot.numReviews} {spot.numReview === 1 ? 'review' : 'reviews'}</div>
        </div>
        <div>
        {+spotId === userId ? null : <OpenModalMenuItem
          itemText="Post Your Review"
          modalComponent={<CreateReview reviewInfo={reviewInfo}/>}
          />}
        </div>
          {/* {reviews.forEach(review => {
            <div>
            <h3>{review.firstName}</h3>
            <h4>{review.createdAt}</h4>
            <h5>{review.review}</h5>
            </div>
          })} */}

      </div>
    </div>
  );
}
