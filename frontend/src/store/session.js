// variables

const SET_USER = 'session/SET_USER'
const REMOVE_USER = 'session/REMOVE_USER'


// action creators
// UPDATE PAYLOAD DATA TO WHATEVER IS RELEVANT
// XSRF TOKEN??
const setUser = (payload) => {
  return {
    type: SET_USER,
    payload
  }
}

// UPDATE PAYLOAD
// XSRF TOKEN???
const removeUser = (payload) => {
  return {
    type: REMOVE_USER,
    payload
  }
}

// reducer
