// variables
const LOAD = 'spots/LOAD';
const LOAD_ONE = 'spots/LOAD_ONE';


// action creators
const loadSpots = (spots) => ({
  type: LOAD,
  spots
})

const loadOneSpot = (spot) => ({
  type: LOAD_ONE,
  spot
})


// selectors
export const allSpots = (state) => Object.values(state.spots)
export const oneSpot = (id) => (state) => state.spots[id]


// thunk action creator
export const allSpotsThunk = () => async dispatch => {
  // console.log("get all spots thunk running")
  const response = await fetch('/api/spots')

  if (response.ok) {
    const spotsJSON = await response.json();
    dispatch(loadSpots(spotsJSON))
  }
}


export const oneSpotThunk = (id) => async dispatch => {
  // console.log("get one spot thunk running")
  const response = await fetch(`/api/spots/${id}`)

  if (response.ok) {
    const spot = await response.json()
    // console.log('spot fetched from oneSpotThunk: ', spot);
    dispatch(loadOneSpot(spot))
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
    default:
      return state
  }
}
