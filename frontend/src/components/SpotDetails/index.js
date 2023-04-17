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
  const spot = useSelector(state => state.spots.singleSpot);
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

    }, [dispatch]);


  if (!spot.avgStarRating) {
    spot.avgStarRating = "New";
  } else if (spot.avgStarRating !== "New") {
    spot.avgStarRating = Number(spot.avgStarRating).toFixed(1);
  }


  const spotImagesArr = spot.spotImages;

  if (!spotImagesArr) return null;

  const reviewInfo = {spotId: spot.id, userId}

  let reviews = 'reviews';
  (spot.numReviews === "1" || spot.numReviews === 1 ? reviews = 'review' : reviews = 'reviews')

  let letter;
  (spot.avgStarRating === "New" ? letter = null : letter = '•')

  const previewImg = spotImagesArr[0];

  const imagesArr = spotImagesArr.slice(1);


  return (
    <div className='spot-detail-overall-container'>
      <div className='spot-detail-inner-container'>

      <div className="spot-detail-container">
        <p className='spot-detail-name'> {spot.name} </p>
        <div className='spot-detail-city-state-country'>
          <p>{spot.city},</p>
          <p>{spot.state},</p>
          <p>{spot.country}</p>
        </div>

        <div className='spot-detail-image-div'>
          <img src={previewImg.url} alt='preview' className='spot-detail-preview-image' />
          <div className='spot-detail-regular-images-div'>
            {imagesArr.map(image => {
              return <img src={image.url} alt="house" className='spot-detail-reg-image' /> })}
          </div>
        </div>

      <div className='spot-detail-hosted-container'>
        <div className='spot-detail-hosted-reserve-desc'>
          <p className='spot-detail-hosted-owner'>Hosted by {`${spot.Owner.firstName} ${spot.Owner.lastName}`}</p>
          <p className='spot-detail-description'>{`${spot.description}`}</p>
        </div>

        <div className="spot-detail-booking-container">
          <div className='spot-detail-night-review'>
            <div> ${spot.price} night</div>
            <div> <i class="fa-solid fa-star" /> {spot.avgStarRating}</div>
            {spot.numReviews === 0 ? null : <div className='num-reviews'>{spot.numReviews} {reviews}</div>}
          </div>
          <button className='spot-detail-reserve-button'>Reserve</button>
        </div>
      </div>

    </div>
      <>
        <div className='spot-detail-dot-reviews-bigger'>
          <div className='star-reviews-bigger'>
            <i class="fa-solid fa-star" /><p className='avg-star-rating-bigger'>{spot.avgStarRating}</p>
          </div>
          <p className='dot-bigger'>{letter}</p>
          {spot.numReviews === 0 ? null : <div className='num-reviews-bigger'>{spot.numReviews} {reviews}</div>}
        </div>

          {+spot.ownerId === +userId || !userId || disableReview ?
          null
          :
          <div className="create-review-modal-spotdetails"> <OpenModalMenuItem
          itemText="Post Your Review"
          modalComponent={<CreateReview reviewInfo={reviewInfo}/>}
          /> </div>}

          <div>
            {spot.avgStarRating !== "New" || !userId || +spot.ownerId === +userId ? null : <p className='first-post-review'>Be the first to post a review!</p>}
          </div>

          <GetAllReviews />

      </>

      </div>
    </div>

  );
}
