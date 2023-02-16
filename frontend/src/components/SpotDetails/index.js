import React from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { oneSpotThunk, oneSpot, clearSpot } from "../../store/spotsReducer";
import CreateReview from "../CreateReview";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { loadReviewsThunk, allReviews } from "../../store/reviewsReducer";

import "./SpotDetails.css";
import GetAllReviews from "../GetAllReviews";

export default function GetSpotDetails() {
  const dispatch = useDispatch();
  const {spotId}= useParams();

  const userId = useSelector(state => state.session.user?.id)
  const spot = useSelector(oneSpot);

  useEffect(() => {
      dispatch(oneSpotThunk(spotId));
      dispatch(loadReviewsThunk(spotId));

      return () => dispatch(clearSpot());

    }, [spotId]);


  // if (!userId) return null;

  // is this going to be a problem? Check!!! Hits this every time - how to fix?
  if (!spot.name) {
    return (
      <h1>Unable to retrieve details. Please try again shortly.</h1>
    )
  }

  if (spot.avgStarRating === null) spot.avgStarRating = "New";
  // console.log(spot.numReviews === 1 ? 'review' : 'reviews');


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
      <div>
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
        <div>
          <GetAllReviews />
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
