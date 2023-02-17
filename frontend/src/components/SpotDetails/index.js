import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { oneSpotThunk, oneSpot, clearSpot } from "../../store/spotsReducer";
import CreateReview from "../CreateReview";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { loadReviewsThunk, allReviews } from "../../store/reviewsReducer";
import GetAllReviews from "../GetAllReviews";

import "./SpotDetails.css";

export default function GetSpotDetails() {
  const dispatch = useDispatch();
  const {spotId}= useParams();

  const userId = useSelector(state => state.session.user?.id)

  const spot = useSelector(state => {
    console.log('single spot state useslector', state.spots.singleSpot)
    return state.spots.singleSpot});

  const review = useSelector(state => state.reviews.spot);

  const reviewArr = Object.values(review);
  let  disableReview = false ;
  reviewArr.forEach(review => {
    if (review.userId === userId) disableReview = true;
  })


  useEffect(() => {

      dispatch(oneSpotThunk(spotId));

      dispatch(loadReviewsThunk(spotId));

      return () => dispatch(clearSpot());

    }, [spotId]);


  // is this going to be a problem? Check!!! Hits this every time - how to fix?
  if (!spot.name) {
    return (
      <h1>Unable to retrieve details. Please try again shortly.</h1>
    )
  }

  if (!spot.avgStarRating) {
    spot.avgStarRating = "New";
  } else if (spot.avgStarRating !== "New") {
    spot.avgStarRating = Number(spot.avgStarRating).toFixed(1);
  }


  const spotImagesArr = spot.spotImages;
  // console.log('spotimagesarr ', spotImagesArr)
  if (!spotImagesArr) return null;

  const reviewInfo = {spotId: spot.id, userId}

  return (
    <div>
      <div className="spot-detail-container">
        <p className='spot-name'> {spot.name} </p>
        <div className='city-state-country'>
        <p>{spot.city},</p>
        <p>{spot.state},</p>
        <p>{spot.country}</p>
        </div>

        <div className='image-div'>
          {spotImagesArr.map(image => {
            return <img src={`${image.url}`} alt="image" className={image.preview === true ? 'previewImage' : 'regImage'} />;
          })}
        </div>

        <div className='hosted-reserve'>
        <div className='hosted-reserve-desc'>
          <p className='hosted-owner'>Hosted by {`${spot.Owner.firstName} ${spot.Owner.lastName}`}</p>
          <p className='spot-description'>{`${spot.description}`}</p>
        </div>

    <div className="res-price-rating-div">

    <div className='night-review'>

        <div className='spot-price-night'>
              <p className='spot-price'>{`$${spot.price}`}</p> <p className='night'> night</p>
        </div>

    <div className = 'reviews-container'>

        <div className='dot-reviews'>
          <div className='star-reviews'>
            <i class="fa-solid fa-star" /><p>{spot.avgStarRating}</p>
          </div>
        {spot.numReviews === 0 ? null : <p>•</p> }
        <div className='num-reviews'>{spot.numReviews === 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews`}</div>
        </div>
          </div>
          </div>
            <button className='reserve-button'>Reserve</button>
                  </div>
                       </div>
                       </div>

      <div>
        <div>
          <i class="fa-solid fa-star">{spot.avgStarRating}</i>
          <div> {spot.numReviews === 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews`}</div>
        </div>
        <div>
        {+spot.ownerId === +userId || !userId || disableReview ? null : <OpenModalMenuItem
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
