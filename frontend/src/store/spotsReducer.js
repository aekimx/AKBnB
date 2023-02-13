// variables
const LOAD = 'spots/LOAD';


// action creators
const loadSpots = (spots) => ({
  type: LOAD,
  spots
})


// selectors
export const allSpots = (state) => Object.values(state.spots.allSpots)


// thunk action creator

export const allSpotsThunk = () => async dispatch => {
  console.log("get all spots thunk running")
  const response = await fetch('/api/spots')
  // console.log("response from get all spots fetch: ", response )

  if (response.ok) {
    const spotsJSON = await response.json();
    dispatch(loadSpots(spotsJSON))
  }
}


// reducers
let initialState = {}

export default function spotsReducer(state = initialState, action) {
  let newState = {}
  switch(action.type) {
    case LOAD:
      newState = {...state};
      // console.log("spotsReducer load spots", action.spots)
      action.spots.Spots.forEach(spot => {
        newState[spot.id] = spot
      })
      console.log('newState ?? ', newState);
      return newState;
    default:
      return state
  }
}
