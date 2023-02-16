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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [previewImgURL, setPreviewImgURL] = useState("");

  const [imgOneURL, setImgOneURL] = useState("");
  const [imgTwoURL, setImgTwoURL] = useState("");
  const [imgThreeURL, setImgThreeURL] = useState("");
  const [imgFourURL, setImgFourURL] = useState("");


  const user = useSelector((state) => state.session.user)

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    const lat = 1.0;
    const lng = 1.0;
    const newSpot = {ownerId: user.id, address, city, state, country, lat, lng, name, description, price}


    const imgUrlArr = [];
      const previewImg = { url: previewImgURL, preview: true}
      imgUrlArr.push(previewImg);

      if (imgOneURL) {
        const imgOne = { url: imgOneURL, preview: false}
        imgUrlArr.push(imgOne)
      }

      if (imgTwoURL) {
        const imgTwo = { url: imgTwoURL, preview: false}
        imgUrlArr.push(imgTwo)
      }
      if (imgThreeURL) {
        const imgThree=  { url: imgThreeURL, preview: false}
        imgUrlArr.push(imgThree);
      }
      if (imgFourURL) {
        const imgFour = { url: imgFourURL, preview: false}
        imgUrlArr.push(imgFour);
      }

      const owner = {id: user.id, firstName: user.firstName, lastName: user.lastName}
      dispatch(createSpotThunk(newSpot, imgUrlArr, owner)) // pass in imgArr
      .then((newSpot) => history.push(`/spots/${newSpot.id}`))
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
      {errors.Street !== undefined ? <h5>{errors.Street}</h5> : null}
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
      <input
          type="url"
          value={previewImgURL}
          placeholder="Preview Image URL"
          onChange={e => setPreviewImgURL(e.target.value)}
        />
        {errors.URL !== undefined ? <h5>{errors.URL}</h5> : null}

        <input
          type="url"
          value={imgOneURL}
          placeholder="Image URL"
          onChange={e => setImgOneURL(e.target.value)}
        />

        <input
          type="url"
          value={imgTwoURL}
          placeholder="Image URL"
          onChange={e => setImgTwoURL(e.target.value)}
        />

        <input
          type="url"
          value={imgThreeURL}
          placeholder="Image URL"
          onChange={e => setImgThreeURL(e.target.value)}
        />

        <input
          type="url"
          value={imgFourURL}
          placeholder="Image URL"
          onChange={e => setImgFourURL(e.target.value)}
        />


  {/* SHOULD BE A LINE HERE separating*/}
    <button type='submit'>Create Spot</button>
    </form>
  );
}
