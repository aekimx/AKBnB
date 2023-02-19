import { useModal } from '../../context/Modal';
import {useDispatch} from 'react-redux';
import { deleteReviewThunk, loadReviewsThunk } from '../../store/reviewsReducer';
import {useHistory} from 'react-router-dom'
import { oneSpotThunk } from '../../store/spotsReducer';

import './DeleteReview.css'

export default function DeleteReview({reviewId, spotId}) {

  // console.log('spotId from prop in delete confirm modal', spotId);
  const {closeModal} = useModal()

  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = async(e) => {
    e.preventDefault();

    const successfulDelete = await dispatch(deleteReviewThunk(reviewId))
    if (successfulDelete.message === "Successfully deleted") {
      const onespot = await dispatch(oneSpotThunk(spotId))
    }
    await closeModal();

  }

  return (
    <div className='delete-spot-modal-div'>
    <p className='confirm-delete-text'> Confirm Delete</p>
    <p className='confirm-delete-text-smaller'> Are you sure you want to delete this review?</p>
      <div className='delete-confirm-modal-buttons'>
        <button onClick={handleDelete} className='delete-spot-button-confirm'>Yes (Delete Review)</button>
        <button onClick={closeModal} className='delete-spot-button-confirm-no'>No (Keep Review)</button>
      </div>
    </div>
  );
}
