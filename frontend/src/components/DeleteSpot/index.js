import './DeleteConfirmModal.css'

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
    <div>
    <h2> Confirm Delete</h2>
    <h3> Are you sure you want to remove this spot from the listing?</h3>
    <button onClick={handleDelete}>Yes(Delete Spot)</button>
    <button onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
}
