import React, { useState } from "react";
import { useModal } from '../../context/Modal';
import {useDispatch} from 'react-redux';
import { createReviewThunk } from '../../store/reviewsReducer';
import {useHistory} from 'react-router-dom'

export default function CreateReview({spotId, userId}) {

  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
    const {closeModal} = useModal()

  const handleSubmit = (e) => {
    e.preventDefault();

    const createdReview = {spotId, userId, review, stars};

    dispatch(createReviewThunk(createdReview))
      .then(closeModal())
      .catch(( async (res) => {
        const data = await res.json()

          if (data.errors) {
            let errorObj = {};
            data.errors.forEach(error => {
              let key = error.split(" ")[0]
              errorObj[key] = error;
            })
            setErrors(errorObj)
          }
        }))
  }

  return (
    <div>
    <h2>How was your stay?</h2>
    {errors.Review !== undefined ? <h5>{errors.Review}</h5> : null }
    {errors.Star !== undefined ? <h5>{errors.Star}</h5> : null }

      <textarea
      placeholder='Leave your review here.'
      onChange={(e) => setReview(e.target.value)} />
      <div >
      <i class="fa-regular fa-star" onClick={(e) => setStars(1)} />
      <i class="fa-regular fa-star" onClick={(e) => setStars(2)} />
      <i class="fa-regular fa-star" onClick={(e) => setStars(3)} />
      <i class="fa-regular fa-star" onClick={(e) => setStars(4)} />
      <i class="fa-regular fa-star" onClick={(e) => setStars(5)} />
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
