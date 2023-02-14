import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { createSpotThunk } from "../../store/spotsReducer";

import "./CreateSpot.css";

export default function CreateSpot() {



  const [errors, setErrors] = useState({});

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const userId = useSelector((state) => state.session.user.id)

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSpot = {ownerId: userId, address, city, state, country, lat, lng, name, description, price}

    // need to fetch the new spot right?
    dispatch(createSpotThunk(newSpot))
      .catch(( async (res) => {
        const data = await res.json()

        if (data.errors) {
          let errorObj = {};
          data.errors.forEach(error => {
            let key = error.split(" ")[0]
            errorObj[key] = error;
          })
          setErrors(errorObj)
        }
      }))
    console.log('new Spot: ', newSpot)

    // history.push(`/newSpot/${state.spots[newSpot.id]}`); need to remember logic for how to get the new spot id

  };

  return (

    <form onSubmit={handleSubmit}>
      <h1>Create a new Spot </h1>
      <h3> Where's your place located?</h3>
      <h4>
        Guests will only get your exact address once they book a reservation
      </h4>
      <div className='create-spot-errors'>
      <label>Country</label>
      {errors.Country !== undefined ? <h5>{errors.Country}</h5> : null}
      </div>
      <input
        type="text"
        value={country}
        placeholder="Country"
        onChange={e => setCountry(e.target.value)}
      />
      <div className='create-spot-errors'>
      <label>Street Address</label>
      {errors.Address !== undefined ? <h5>{errors.Address}</h5> : null}
      </div>
      <input
        type="text"
        value={address}
        placeholder="Address"
        onChange={e => setAddress(e.target.value)}
      />
      <div className='create-spot-errors'>
        <div>
        <label>City</label>
        {errors.City !== undefined ? <h5>{errors.City}</h5> : null}
        </div>
        <input
          type="text"
          value={city}
          placeholder="City"
          onChange={e => setCity(e.target.value)}
        />
        <div className='create-spot-errors'>
        <label>State</label>
        {errors.State !== undefined ? <h5>{errors.State}</h5> : null}
        </div>
        <input
          type="text"
          value={state}
          placeholder="State"
          onChange={e => setState(e.target.value)}
        />
      </div>
      <div>
      <div className='create-spot-errors'>
        <label>Latitude</label>
        {errors.Latitude !== undefined ? <h5>{errors.Latitude}</h5> : null}
        </div>
        <input
          type="text"
          value={lat}
          placeholder="Latitude"
          onChange={e => setLat(e.target.value)}
        />
        <div className='create-spot-errors'>
        <label>Longitude</label>
        {errors.Longitude !== undefined ? <h5>{errors.Longitude}</h5> : null}
        </div>
        <input
          type="text"
          value={lng}
          placeholder="Longitude"
          onChange={e => setLng(e.target.value)}
        />
      </div>
      {/* SHOULD BE A LINE HERE separating*/}
      <div>
        <h3> Describe your place to guests</h3>
        <h4>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood
        </h4>
        <textarea
        value={description}
        placeholder="Please write at least 30 characters"
        onChange={e => setDescription(e.target.value)} />
        {errors.Description !== undefined ? <h5>{errors.Description}</h5> : null}
      </div>
      {/* SHOULD BE A LINE HERE separating*/}
      <div>
        <h3> Create a title for your spot </h3>
        <h4>
          {" "}Catch guest's attention with a spot title that highlights what
          makes your place special
        </h4>
        <input
          type="text"
          value={name}
          placeholder="Name of your spot"
          onChange={e => setName(e.target.value)}
        />
        {errors.Name !== undefined ? <text>{errors.Name}</text> : null}
      </div>
      {/* SHOULD BE A LINE HERE separating*/}
      <div>
        <h3> Set a base price for your spot </h3>
        <h4>
          {" "}Competitive pricing can help your listing stand out and rank
          higher in search results
        </h4>
        <input
          type="text"
          value={price}
          placeholder="Price per night (USD)"
          onChange={e => setPrice(e.target.value)}
        />
        {errors.Price !== undefined ? <text>{errors.Price}</text> : null}
      </div>
      {/* SHOULD BE A LINE HERE separating*/}
      {/* THINK ABOUT HOW TO LINK SPOT IMAGES TO THIS */}
      <h3> Liven up your spot with photos </h3>
      <h4>Submit a link to at least one photo to publish your spot</h4>
      {/* <input
          type="url"
          // value={name}
          placeholder="Preview Image URL"
          // onChange={e => setPrice(e.target.value)}
        />

        <input
          type="url"
          // value={name}
          placeholder="Image URL"
          // onChange={e => setPrice(e.target.value)}
        />
        <input
          type="url"
          // value={name}
          placeholder="Image URL"
          // onChange={e => setPrice(e.target.value)}
        />
        <input
          type="url"
          // value={name}
          placeholder="Image URL"
          // onChange={e => setPrice(e.target.value)}
        />
        <input
          type="url"
          // value={name}
          placeholder="Image URL"
          // onChange={e => setPrice(e.target.value)}
        /> */}

  {/* SHOULD BE A LINE HERE separating*/}
    <button type='submit'>Create Spot</button>
    </form>
  );
}
