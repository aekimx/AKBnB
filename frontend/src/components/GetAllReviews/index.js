import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect, useParams } from "react-router-dom";
import { loadReviewsThunk, allReviews } from "../../store/reviewsReducer";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReview from "../DeleteReview";

export default function GetAllReviews() {

  const dispatch = useDispatch();
  const {spotId} = useParams()
  const userId = useSelector(state => state.session.user?.id)

  useEffect(() => {
    dispatch(loadReviewsThunk(spotId))
    .then(async (res) => {
      const data = await res.json();
      console.log(data);
    })
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
      {/* <h1> TESTING ALL REVIEWS</h1> */}
      {reviewsArrNew.map(review => {
        return (
        <div>
          {userId === review.userId ?
          <OpenModalMenuItem itemText="Delete" modalComponent={<DeleteReview reviewId={review.id}/>} />
          : null}

          <h3>{review.User.firstName}</h3>
          <h3>{review.createdAt}</h3>
          <p>{review.review}</p>
        </div>)
      })}
    </div>
  )
}
