// variables
const LOAD = 'spots/LOAD';
const LOAD_ONE = 'spots/LOAD_ONE';
const CREATE = 'spots/CREATE'


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


// selectors
export const allSpots = (state) => Object.values(state.spots)
export const oneSpot = (id) => (state) => state.spots[id]


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

export const createSpotThunk = (data, spotId) => async dispatch => {
  const response = await fetch('/api/spots', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  // come up with error handling!!!! VALIDATION ERRORS!!!
  if (!response.ok) {
    let error;
    if (response.status === 400) {
      error = await response.json();
      return null // <<<< ----- FIX THIS!!!!!
    }
  } else {
    const newSpot = await response.json()
    dispatch(createSpot(newSpot))
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
    default:
      return state
  }
}
