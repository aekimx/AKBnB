import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "./CreateSpot.css";

export default function CreateSpot() {
  const history = useHistory();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    history.push(`/`); // change to the specific spot there after
    return null;
  };

  // need to think about how to handle submit?

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a new Spot </h1>
      <h3> Where's your place located?</h3>
      <h4>
        Guests will only get your exact address once they book a reservation
      </h4>
      <label>Country</label>
      <input
        type="text"
        value={country}
        placeholder="Country"
        onChange={e => setCountry(e.target.value)}
      />
      <label>Street Address</label>
      <input
        type="text"
        value={address}
        placeholder="Address"
        onChange={e => setAddress(e.target.value)}
      />
      <div>
        <label>City</label>
        <input
          type="text"
          value={city}
          placeholder="City"
          onChange={e => setCity(e.target.value)}
        />
        <label>State</label>
        <input
          type="text"
          value={state}
          placeholder="State"
          onChange={e => setState(e.target.value)}
        />
      </div>
      <div>
        <label>Latitude</label>
        <input
          type="text"
          value={lat}
          placeholder="Latitude"
          onChange={e => setLat(e.target.value)}
        />
        <label>Longitude</label>
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
      </div>
      {/* SHOULD BE A LINE HERE separating*/}
      {/* THINK ABOUT HOW TO LINK SPOT IMAGES TO THIS */}
      <h3> Liven up your spot with photos </h3>
      <h4>Submit a link to at least one photo to publish your spot</h4>
      <input
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
        />

  {/* SHOULD BE A LINE HERE separating*/}
    <button>Create Spot</button>
    </form>
  );
}
