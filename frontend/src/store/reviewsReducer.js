import { csrfFetch } from "./csrf";

//variables
const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'

//action creators
const createReview = (review) => ({
  type: CREATE_REVIEW,
  review
})

const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews
})

// selector

export const allReviews = state => state.reviews.spot

//reviews: {
    // When on a single spot, use the spot slice.
    // spot: {
    //   [reviewId]: {
    //     reviewData,
    //     User: {
    //       userData,
    //     },
    //     ReviewImages: [imagesData],
    //   },

//thunk action creator
export const createReviewThunk = (reviewData) => async dispatch => {
  const response = await csrfFetch('/api/reviews', {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData)
  })
  if (response.ok) {
    const newReview = response.json();
    dispatch(createReview(newReview))
  }
}

export const loadReviewsThunk = (spotId) => async dispatch => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadReviews(reviews));
  }
}

//reducer
let initialState = {
  spot: {},
  user: {}
}

export default function reviewsReducer ( state = initialState, action) {
  let newState = {};
  switch(action.type) {
    case CREATE_REVIEW:
      newState = {...state, spot: {...state.spot}, user: {...state.user}}
      newState.spot[action.review.id] = action.review;
      return newState;
    case LOAD_REVIEWS:
      newState = {...state, spot: {...state.spot}, user: {...state.user}}
      action.reviews.forEach(review => {
        newState.spot[review.Id] = review
      })
      console.log('newstate from reviews reducer' ,newState)
      return newState
    default:
      return state
  }
}
