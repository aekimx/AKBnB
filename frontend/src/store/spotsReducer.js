import { csrfFetch } from './csrf';

// variables
const LOAD = 'spots/LOAD';
const LOAD_ONE = 'spots/LOAD_ONE';
const CREATE = 'spots/CREATE'
const LOAD_CURRENT = 'spots/LOAD_CURRENT'



// action creators
const loadSpots = (spots) => ({
  type: LOAD,
  spots
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


// selectors
export const allSpots = (state) => (state.spots)
export const oneSpot = (id) => (state) => state.spots[id]
export const currentSpots = (state) => (state.spots)


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
  console.log("create spot thunk running")
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
  console.log("load current user spots thunk running")
  const response = await csrfFetch('/api/spots/current');

  if (response.ok) {
    const userSpots = await response.json()
    dispatch(currentUserSpots(userSpots))
  }
}

// reducers
let initialState = {}

export default function spotsReducer(state = initialState, action) {
  let newState = {}
  switch(action.type) {
    case LOAD:
      newState = {...state};
      action.spots.Spots.forEach(spot => {
        newState[spot.id] = spot
      })
      return newState;
    case LOAD_ONE:
        newState = {...state};
        newState[action.spot.id] = action.spot
        return newState
    case CREATE:
      newState = {...state, [action.spot.id]: action.spot}
      return newState;
    case LOAD_CURRENT:
      newState = {...state}
      action.spots.Spots.forEach(spot => {
        newState[spot.id] = spot
      })
      return newState;
    default:
      return state
  }
}
