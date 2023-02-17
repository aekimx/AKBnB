import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect, useParams } from "react-router-dom";
import { loadReviewsThunk, allReviews } from "../../store/reviewsReducer";
import { oneSpotThunk } from "../../store/spotsReducer";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReview from "../DeleteReview";

export default function GetAllReviews() {

  const dispatch = useDispatch();
  const {spotId} = useParams()
  const userId = useSelector(state => state.session.user?.id)

  useEffect(() => {
    dispatch(loadReviewsThunk(spotId))
    .then(oneSpotThunk(spotId))
  }, [dispatch, spotId])

  const reviews = useSelector(allReviews);

  const reviewsArr = Object.values(reviews);

  const reviewsArrNew = [];
  for (let i = reviewsArr.length-1 ; i >= 0 ; i--) {
    reviewsArrNew.push(reviewsArr[i]);
  }

  if (!reviewsArr[0]) return null;

  return (
    <div>
      {reviewsArrNew.map(review => {
        return (
        <div>
          {userId === review.userId ?
          <OpenModalMenuItem itemText="Delete" modalComponent={<DeleteReview reviewId={review.id} spotId/>} />
          : null}

          <h3>{review.User.firstName}</h3>
          <h3>{review.createdAt}</h3>
          <p>{review.review}</p>
        </div>)
      })}
    </div>
  )
}
