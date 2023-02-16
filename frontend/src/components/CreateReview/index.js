import React, { useState } from "react";
import { useModal } from '../../context/Modal';
import {useDispatch, useSelector} from 'react-redux';
import { createReviewThunk } from '../../store/reviewsReducer';
import {useHistory} from 'react-router-dom'

import './CreateReview.css'

export default function CreateReview({reviewInfo: {spotId, userId}}) {
  // console.log('review info prop', reviewInfo);
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const {closeModal} = useModal()

  const {firstName, lastName} = useSelector(state=> state.session.user)

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewData = {spotId, userId, review, stars};
    // console.log('created review' , createdReview);
    const User = { id: userId, firstName, lastName}

    dispatch(createReviewThunk(reviewData, User))
      .then(closeModal())
      // dont think we need this?
      // .catch(( async (res) => {
      //   const data = await res.json()

      //     if (data.errors) {
      //       let errorObj = {};
      //       data.errors.forEach(error => {
      //         let key = error.split(" ")[0]
      //         errorObj[key] = error;
      //       })
      //       setErrors(errorObj)
      //     }
      //   }))
  }

  return (
    <div>
    <h2>How was your stay?</h2>
    {errors.Review !== undefined ? <h5>{errors.Review}</h5> : null }
    {errors.Star !== undefined ? <h5>{errors.Star}</h5> : null }

      <textarea
      placeholder='Leave your review here.'
      onChange={(e) => setReview(e.target.value)} />
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
      <button disabled={review.length < 10 || stars < 1} onClick={handleSubmit}>Submit Your Review</button>
    </div>
  )
}


//   const handleDelete = (e) => {
//     e.preventDefault();
//     dispatch(deleteSpotThunk(spotId))
//       .then(closeModal())
//       .then(() => history.push('/spots/current'))
//   }

//   return (
//     <div>
//     <h2> Confirm Delete</h2>
//     <h3> Are you sure you want to remove this spot from the listing?</h3>
//     <button onClick={handleDelete}>Yes(Delete Spot)</button>
//     <button onClick={closeModal}>No (Keep Spot)</button>
//     </div>
//   );
// }
