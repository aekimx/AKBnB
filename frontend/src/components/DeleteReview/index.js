import { useModal } from '../../context/Modal';
import {useDispatch} from 'react-redux';
import { deleteReviewThunk } from '../../store/reviewsReducer';
import { oneSpotThunk } from '../../store/spotsReducer';

import './DeleteReview.css'

export default function DeleteReview({reviewId, spotId}) {

  const dispatch = useDispatch();
  const {closeModal} = useModal()

  const handleDelete = async(e) => {
    e.preventDefault();
    dispatch(deleteReviewThunk(reviewId))
    .then(() => dispatch(oneSpotThunk(spotId)))
    .then(() => closeModal())
  }

  return (
    <div className='delete-review-modal-container'>
      <div className='delete-review-text'> Confirm Delete</div>
      <p className='delete-review-text-smaller'> Are you sure you want to delete this review?</p>
      <div className='delete-review-buttons-container'>
        <button onClick={handleDelete} className='delete-review-button-yes'>Yes (Delete Review)</button>
        <button onClick={closeModal} className='delete-review-button'>No (Keep Review)</button>
      </div>
    </div>
  );
}
