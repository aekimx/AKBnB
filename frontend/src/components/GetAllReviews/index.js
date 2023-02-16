import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect, useParams } from "react-router-dom";
import { loadReviewsThunk, allReviews } from "../../store/reviewsReducer";

export default function GetAllReviews() {

  const dispatch = useDispatch();
  const {spotId} = useParams()

  useEffect(() => {
    dispatch(loadReviewsThunk(spotId))
    .then(async (res) => {
      const data = await res.json();
      console.log(data);
    })
  }, [dispatch, spotId])

  const reviews = useSelector(allReviews);

  const reviewsArr = Object.values(reviews);
  console.log('reviewsArr ', reviewsArr)

  if (!reviewsArr[0]) return null;

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
