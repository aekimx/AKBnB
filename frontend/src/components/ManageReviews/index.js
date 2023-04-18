import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadCurrentReviewsThunk } from '../../store/reviewsReducer';
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

  // const deleteReview = (reviewId) => {
  //   dispatch(deleteUserReviewThunk(reviewId))
  // }

  // const updateReview = (reviewId) => {
  //   dispatch(updateReview(reviewId))
  // }

  return (
    <>
    <div className='currentreviews-container'>
      <div className='currentreviews-managereviews-text'> Manage Reviews </div>
      <div className='currentreviews-inner-container'>
        {reviewsArr.length ?
        <>
      {reviewsArr.map(review => {
        return (
          <div className='currentreviews-inner-container'>
            <div className='currentreviews-spot-name'> {review.Spot.name} </div>
            <div> {review.createdAt.slice(0,10)} </div>
            <div> {review.review} </div>
            <div className='currentreviews-buttons'>
              <div className='currentreviews-update'> Update</div>
              <div className='currentreviews-delete'> Delete</div>
            </div>
          </div>
        )

      })}
      </> :
        <div> No reviews yet!</div>}
      </div>
    </div>
    </>
  )
}
