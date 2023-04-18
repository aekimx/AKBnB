import React, { useState } from "react";
import { useModal } from '../../context/Modal';
import {useDispatch, useSelector} from 'react-redux';
import { createReviewThunk } from '../../store/reviewsReducer';
import { oneSpotThunk } from "../../store/spotsReducer";

import './CreateReview.css'

export default function CreateReview({reviewInfo: {spotId, userId}}) {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);

  const dispatch = useDispatch();
  const {closeModal} = useModal()

  const {firstName, lastName} = useSelector(state=> state.session.user)

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewData = {spotId, userId, review, stars};

    const User = { id: userId, firstName, lastName}

    dispatch(createReviewThunk(reviewData, User))
    // change the state in spot details to rerender
    .then(() => dispatch(oneSpotThunk(spotId)))
    .then(() => closeModal())

  }

  return (
    <div className='create-review-div'>
      <p className='create-review-text'>How was your stay?</p>

      <div className='star-hover-text-review'>


      <textarea
        className='leave-review-here-textarea'
        placeholder='Leave your review here.'
        maxLength='2000'
        onChange={(e) => setReview(e.target.value)} />

    <div className='stars-text-icons'>
        <div class="rate">
          <input type="radio" id="star5" name="rate" onChange={(e) => setStars(5)}/>
          <label for="star5" title="text">5 stars</label>
          <input type="radio" id="star4" name="rate" onChange={(e) => setStars(4)} />
          <label for="star4" title="text">4 stars</label>
          <input type="radio" id="star3" name="rate" onChange={(e) => setStars(3)} />
          <label for="star3" title="text">3 stars</label>
          <input type="radio" id="star2" name="rate" onChange={(e) => setStars(2)} />
          <label for="star2" title="text">2 stars</label>
          <input type="radio" id="star1" name="rate" onChange={(e) => setStars(1)} />
          <label for="star1" title="text">1 star</label>
        </div>
        <span className='stars-text-create-review'>Stars</span>
        </div>


      </div>

        <div className='create-review-button-div'>
          <button
          disabled={review.length < 10 || stars < 1}
          onClick={handleSubmit}
          className='create-review-button'>
            Submit Your Review
          </button>
        </div>
    </div>
  )
}
