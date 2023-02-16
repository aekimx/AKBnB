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


//thunk action creator
export const createReviewThunk = (reviewData, User) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${reviewData.spotId}/reviews`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData)
  })

  if (response.ok) {
    const newReview = await response.json();
    newReview.User = User;

    let [year, month] = newReview.createdAt.slice(0,7).split("-")
    const dates = {
      "01": "January",
      "02": "February",
      "03": "March",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "August",
      "09": "September",
      "10": "October",
      "11": "November",
      "12": "December",
    }
    month = dates[month]
    let reviewDate = `${month} ${year}`
    newReview.createdAt = reviewDate

    dispatch(createReview(newReview))
    return newReview;
  }
}


export const loadReviewsThunk = (spotId) => async dispatch => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const reviews = await response.json();
    // changing date format
    reviews.Reviews.forEach((review) => {
      let [year, month] = review.createdAt.slice(0,7).split("-")
      const dates = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December",
      }
      month = dates[month]
      let reviewDate = `${month} ${year}`
      review.createdAt = reviewDate
    })

    dispatch(loadReviews(reviews));
    return reviews;
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
      newState = {...state, spot: {}, user: {...state.user}}
      // console.log('action.reviews ', action.reviews)
      action.reviews.Reviews.forEach(review => {
        newState.spot[review.id] = review
      })
      return newState
    default:
      return state
  }
}
