import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { createSpotThunk } from "../../store/spotsReducer";
import { clearSpot } from "../../store/spotsReducer";



import "./CreateSpot.css";

export default function CreateSpot() {

  const [errors, setErrors] = useState({});
  const [previewImgError, setPreviewImgError] = useState({});

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

  // useEffect(() => {
  //   return dispatch(clearSpot());
  // }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault();

    const lat = 1.0;
    const lng = 1.0;
    const newSpot = {ownerId: user.id, address, city, state, country, lat, lng, name, description, price}


    const imgUrlArr = [];
      const previewImg = { url: previewImgURL, preview: true}
      imgUrlArr.push(previewImg);

      if (imgOneURL) {
        const imgOne = { url: imgOneURL, preview: 'false'}
        imgUrlArr.push(imgOne)
      }

      if (imgTwoURL) {
        const imgTwo = { url: imgTwoURL, preview: 'false'}
        imgUrlArr.push(imgTwo)
      }
      if (imgThreeURL) {
        const imgThree=  { url: imgThreeURL, preview: 'false'}
        imgUrlArr.push(imgThree);
      }
      if (imgFourURL) {
        const imgFour = { url: imgFourURL, preview: 'false'}
        imgUrlArr.push(imgFour);
      }


      const owner = {id: user.id, firstName: user.firstName, lastName: user.lastName}

      if (!previewImgURL) {
        setPreviewImgError({url: "Please include a preview image"})
      } else {
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
      }
  };

  return (

    <form onSubmit={handleSubmit}>
      <div className='form-container'>
      <p className='form-header'>Create a new Spot </p>
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

        <div className='comma'>
        <input type="text" value={city} placeholder="City" onChange={e => setCity(e.target.value)} />
        <p className='comma-comma'>, </p>
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
      {/* THINK ABOUT HOW TO LINK SPOT IMAGES TO THIS */}
      <div className='guest-stay-box'>
      <p className='guest-stay'> Liven up your spot with photos </p>
      <p className='guest-stay-desc'>Submit a link to at least one photo to publish your spot</p>
      <input
          type="url"
          value={previewImgURL}
          placeholder="Preview Image URL"
          onChange={e => setPreviewImgURL(e.target.value)}
        />
        {previewImgError !== false ? <p className='create-url-error'>{previewImgError.url}</p> : null}

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
      </div>


  {/* SHOULD BE A LINE HERE separating*/}
  <div className='button-box'>
    <button className='submit-button'type='submit'>Create Spot</button>
  </div>
    </div>
  </div>
</form>
  );
}
