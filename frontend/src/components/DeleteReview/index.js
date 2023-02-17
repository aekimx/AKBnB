import { useModal } from '../../context/Modal';
import {useDispatch} from 'react-redux';
import { deleteReviewThunk } from '../../store/reviewsReducer';
import {useHistory} from 'react-router-dom'
import { oneSpotThunk } from '../../store/spotsReducer';


export default function DeleteReview({reviewId}, spotId) {

  // console.log('spotId from prop in delete confirm modal', spotId);
  const {closeModal} = useModal()

  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteReviewThunk(reviewId))
      .then(dispatch(oneSpotThunk(spotId)))
      .then(closeModal())
      // .then(() => history.push('/spots/current'))
  }

  return (
    <div>
    <h2> Confirm Delete</h2>
    <h3> Are you sure you want to delete this review?</h3>
    <button onClick={handleDelete}>Yes(Delete Review)</button>
    <button onClick={closeModal}>No (Keep Review)</button>
    </div>
  );
}
