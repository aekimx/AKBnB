import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadCurrentReviewsThunk, deleteUserReviewThunk } from '../../store/reviewsReducer';
import "./ManageReviews.css"

export default function ManageReviews() {
  const dispatch = useDispatch();
  // const user = useSelector(state => state.session.user)
  const reviews = useSelector(state => state.reviews.user)

  useEffect(() => {
    dispatch(loadCurrentReviewsThunk())
  }, [dispatch])

  if (!reviews) return (<div> You don't have any reviews! </div>)
  const reviewsArr = Object.values(reviews)

  const deleteReview = (reviewId) => {
    dispatch(deleteUserReviewThunk(reviewId))
  }

  return (
    <>
    <div className='currentreviews-container'>
      {reviewsArr.map(review => {
        return (
          <div className='currentreviews-inner-container'>
            {/* <div> <img src={review.Spot.previewImage} /> </div> */}
            <div> {review.stars} </div>
            <div> {review.review} </div>
            <div>
              <div> Update Review</div>
              <div onClick={deleteReview(review.id)} > Delete Review</div>
            </div>
          </div>
        )

      })}
    </div>
    </>
  )
}
