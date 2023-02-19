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

  // console.log('spot inputted into spotId ', spot.id)

  const handleSubmit = e => {
    e.preventDefault();
    const lat = 1;
    const lng = 1;
    const updatedSpot = {spotId: spot.id, spot: userId, address, city, state, country, lat, lng, name, description,price};

    dispatch(updateSpotThunk(updatedSpot))
      .then(() => history.push(`/spots/${spot.id}`))
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
      <div className='form-container'>
      <p className='form-header'>Update your Spot</p>
      <p className='place-located'> Where's your place located?</p>
      <p className='guests-location'>
        Guests will only get your exact address once they book a reservation
      </p>
      <div className='form-inputs'>


        <div className='country-street-input'>
<div className='error-formatting'>
      <label>Country</label>
      <div className='create-spot-errors'>
      {errors.Country !== undefined ? <p className='error-text'>{errors.Country}</p> : null}
      </div>

      </div>

      <input
        type="text"
        value={country}
        placeholder="Country"
        onChange={e => setCountry(e.target.value)}
      />
      </div>

    <div className='country-street-input'>

 <div className='error-formatting'>

      <label>Street Address</label>
      <div className='create-spot-errors'>
      {errors.Street !== undefined ? <p className='error-text'>{errors.Street}</p> : null}
      </div>

      </div>


      <input
        type="text"
        value={address}
        placeholder="Address"
        onChange={e => setAddress(e.target.value)}
      />
      </div>

      <div className='city-state'>
        <div className="city">

        <div className='error-formatting'>

        <label>City</label>
        <div className='create-spot-errors'>
          {errors.City !== undefined ? <p className='error-text'>{errors.City}</p> : null}
        </div>

    </div>

        <div className='comma-update-spot'>
        <input type="text" value={city} placeholder="City" onChange={e => setCity(e.target.value)} />
        <p>, </p>
        </div>
        </div>

      <div className="state">

      <div className='error-formatting'>

        <label>State</label>
        <div className='create-spot-errors'>
          {errors.State !== undefined ? <p className='error-text'>{errors.State}</p> : null}
        </div>

    </div>

        <input type="text" value={state} placeholder="State" onChange={e => setState(e.target.value)}/>
        </div>
      </div>

      {/* SHOULD BE A LINE HERE separating*/}
      <div className='guest-stay-box'>
        <p className='guest-stay'> Describe your place to guests</p>
        <p className='guest-stay-desc'>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood
        </p>
        <textarea
        value={description}
        placeholder="Please write at least 30 characters"
        onChange={e => setDescription(e.target.value)} />
        {errors.Description !== undefined ? <p className='error-text'>{errors.Description}</p> : null}
      </div>

      {/* SHOULD BE A LINE HERE separating*/}

      <div className='guest-stay-box'>
        <p className='guest-stay'> Create a title for your spot </p>
        <p className='guest-stay-desc'>
          {" "}Catch guest's attention with a spot title that highlights what
          makes your place special
        </p>
        <input
          type="text"
          value={name}
          placeholder="Name of your spot"
          onChange={e => setName(e.target.value)}
        />
        {errors.Name !== undefined ? <p className='error-text'>{errors.Name}</p> : null}
      </div>

      {/* SHOULD BE A LINE HERE separating*/}

      <div className='guest-stay-box'>
        <p className='guest-stay'> Set a base price for your spot </p>
        <p className='guest-stay-desc'>
          {" "}Competitive pricing can help your listing stand out and rank
          higher in search results
        </p>
        <div className='dollarsign-input'>
        <p className="dollarsign">$</p>
        <input
          type="text"
          value={price}
          placeholder="Price per night (USD)"
          onChange={e => setPrice(e.target.value)}
        />
        </div>
        {errors.Price !== undefined ? <p className='error-text'>{errors.Price}</p> : null}
      </div>


  {/* SHOULD BE A LINE HERE separating*/}
  <div className='button-box'>
    <button className='submit-button'type='submit'>Update Spot</button>
    </div>
    </div>
  </div>
</form>
  )
}
