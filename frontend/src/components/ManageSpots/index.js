import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import './ManageSpots.css'

export default function ManageSpots() {

  const userId = useSelector((state) => state.session.user.id)

  // use that user id to use selector for spots based on user id


  const dispatch = useDispatch();

  // display as you did spot details


  return (
    <h1> MANAGE SPOTS </h1>
  )
}
