import './DeleteSpot.css'

import { useModal } from '../../context/Modal';
import {useDispatch} from 'react-redux';
import { deleteSpotThunk } from '../../store/spotsReducer';
import {useHistory} from 'react-router-dom'

export default function DeleteConfirmModal({spotId}) {

  console.log('spotId from prop in delete confirm modal', spotId);
  const {closeModal} = useModal()

  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteSpotThunk(spotId))
      .then(closeModal())
      .then(() => history.push('/spots/current'))
  }

  return (
    <div className='delete-spot-modal-div'>
      <p className='confirm-delete-text'> Confirm Delete</p>
      <p className='confirm-delete-text-smaller'> Are you sure you want to remove this spot from the listing?</p>
      <div className='delete-confirm-modal-buttons'>
        <button onClick={handleDelete} className='delete-spot-button-confirm'>Yes (Delete Spot)</button>
        <button onClick={closeModal} className='delete-spot-button-confirm-no'>No (Keep Spot)</button>
      </div>
    </div>
  );
}
