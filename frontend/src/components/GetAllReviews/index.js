import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { loadReviewsThunk, allReviews } from "../../store/reviewsReducer";
import { oneSpotThunk } from "../../store/spotsReducer";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReview from "../DeleteReview";

import "./GetAllReviews.css"

export default function GetAllReviews() {

  const dispatch = useDispatch();
  const {spotId} = useParams()
  const userId = useSelector(state => state.session.user?.id)

  useEffect(() => {
    dispatch(loadReviewsThunk(spotId))
    .then(dispatch(oneSpotThunk(spotId)))
  }, [dispatch, spotId])

  const reviews = useSelector(allReviews);

  const reviewsArr = Object.values(reviews);

  const reviewsArrNew = [];
  for (let i = reviewsArr.length-1 ; i >= 0 ; i--) {
    reviewsArrNew.push(reviewsArr[i]);
  }

  if (!reviewsArr[0]) return null;

  return (
    <div className='reviews-div'>
      {reviewsArrNew.map(review => {
        return (
        <div className='get-all-review-tile'>
          {userId === review.userId ?
          <OpenModalMenuItem itemText="Delete" modalComponent={<DeleteReview reviewId={review.id} spotId={spotId}/>} />
          : null}

          <p className='firstname-review'>{review.User.firstName}</p>
          <p className='date-review'>{review.createdAt}</p>
          <p className='review-review'>{review.review}</p>
        </div>)
      })}
    </div>
  )
}
