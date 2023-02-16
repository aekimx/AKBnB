import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect, useParams } from "react-router-dom";
import { loadReviewsThunk, allReviews } from "../../store/reviewsReducer";

export default function GetAllReviews() {

  const dispatch = useDispatch();
  const {spotId} = useParams()

  useEffect(() => {
    dispatch(loadReviewsThunk(spotId))
  }, [dispatch, spotId])

  const reviews = useSelector(allReviews);
  const reviewsArr = Object.values(reviews);

  // console.log('reviews array from useselector in useeffect', reviewsArr);
  // if (!reviewsArr) return null;
  reviewsArr.map(review => review.createdAt = review.createdAt.slice(0,10));

  return (
    <div>
      {/* <h1> TESTING ALL REVIEWS</h1> */}
      {reviewsArr.map(review => {
        return (<div>
          <h3>{review.User.firstName}</h3>
          <h3>{review.createdAt}</h3>
          <p>{review.review}</p>
        </div>)
      })}
    </div>
  )
}
