import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSpotThunk} from "../../store/spotsReducer";
import { useHistory } from "react-router-dom";

import "./UpdateSpot.css";

export default function UpdateSpot({spot}) {

  const dispatch = useDispatch();
  const history = useHistory();

  const [errors, setErrors] = useState({});

  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);

  const userId = useSelector(state => state.session.user.id);

  const handleSubmit = e => {
    e.preventDefault();
    const lat = 1;
    const lng = 1;
    const updatedSpot = {spotId: +spot.spotId, spot: userId, address, city, state, country, lat, lng, name, description,price};

    dispatch(updateSpotThunk(updatedSpot))
      .then(() => history.push(`/spots/${spot.spotId}`))
      .catch(async res => {
        const data = await res.json();

        if (data.errors) {
          let errorObj = {};
          data.errors.forEach(error => {
            let key = error.split(" ")[0];
            errorObj[key] = error;
          });
          setErrors(errorObj);
        }
    })
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Update your spot </h1>
      <h3> Where's your place located?</h3>
      <h4>Guests will only get your exact address once they book a reservation</h4>
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
        <h4>Competitive pricing can help your listing stand out and rank higher in search results</h4>
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
      {/* <h3> Liven up your spot with photos </h3>
      <h4>Submit a link to at least one photo to publish your spot</h4> */}
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
    <button type='submit'>Update Spot</button>
    </form>
  );
}
