import { csrfFetch } from './csrf';

// variables
const LOAD = 'spots/LOAD';
const LOAD_ONE = 'spots/LOAD_ONE';
const CREATE = 'spots/CREATE';
const LOAD_CURRENT = 'spots/LOAD_CURRENT';
const UPDATE = 'spots/UPDATE';
const DELETE = 'spots/DELETE';



// action creators
const loadSpots = (spots) => ({
  type: LOAD,
  spots // payload
})

const loadOneSpot = (spot) => ({
  type: LOAD_ONE,
  spot
})

const createSpot = (spotInfo)=> ({
  type: CREATE,
  spot: spotInfo
})

const currentUserSpots = (spots) => ({
  type: LOAD_CURRENT,
  spots
})

const updateSpot = (updatedSpot) => ({
  type: UPDATE,
  updatedSpot
})

const deleteSpot = (spotId) => ({
  type: DELETE,
  spotId
})

// selectors
export const allSpots = (state) => (state.spots.allSpots)
export const oneSpot = (state) => (state.spots.singleSpot)
export const currentSpots = (state) => (state.spots.allSpots)


// thunk action creator
export const allSpotsThunk = () => async dispatch => {
  const response = await fetch('/api/spots')

  if (response.ok) {
    const spotsJSON = await response.json();
    dispatch(loadSpots(spotsJSON))
  }
}

export const oneSpotThunk = (id) => async dispatch => {
  const response = await fetch(`/api/spots/${id}`)

  if (response.ok) {
    const spot = await response.json()
    dispatch(loadOneSpot(spot))
  }
}

export const createSpotThunk = (data) => async dispatch => {
  // console.log("create spot thunk running")
  const response = await csrfFetch('/api/spots', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  if (response.ok) {
    const newSpot = await response.json()
    dispatch(createSpot(newSpot))
    }
}

export const loadCurrentUserSpots = () => async dispatch => {
  // console.log("load current user spots thunk running")
  const response = await csrfFetch('/api/spots/current');

  if (response.ok) {
    const userSpots = await response.json()
    dispatch(currentUserSpots(userSpots))
  }
}

export const updateSpotThunk = (data) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${+data.spotId}`, {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  if (response.ok) {
    const updatedSpot = await response.json()
    dispatch(updateSpot(updatedSpot))
  }
}

export const deleteSpotThunk = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${+spotId}`, {
    method: 'delete',
  })
  // console.log('response from deleteSpotThunk', response);

  if (response.ok) {
    const successfulDelete = await response.json();
    // console.log('if repsonse.ok', successfulDelete)
    dispatch(deleteSpot(spotId));
    return successfulDelete; // should be close modal?
  }
}


// reducers
let initialState = {
  allSpots: {},
  singleSpot: {}
}

export default function spotsReducer(state = initialState, action) {
  let newState={}
  switch(action.type) {
    case LOAD:
      newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}}
      action.spots.Spots.forEach(spot => {
        newState.allSpots[spot.id] = spot
      });
      return newState;
    case LOAD_ONE:
      newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}}
      newState.singleSpot = action.spot;
      return newState;
    case CREATE:
      newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}}
      newState.allSpots[action.spot.id] = action.spot;
      return newState;
    case LOAD_CURRENT:
      newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}}
      action.spots.Spots.forEach(spot => {
        newState.allSpots[spot.id] = spot
      })
      return newState;
    case UPDATE:
      newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}}
        newState.singleSpot = action.updatedSpot
        return newState;
    case DELETE:
      newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}}
        delete newState.allSpots[action.spotId];
        return newState;
    default:
      return state
  }
}
