import React, {useEffect, useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { allSpots, allSpotsThunk, clearSpot } from '../../store/spotsReducer';
import mapboxgl from 'mapbox-gl';
import './GetAllSpots.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWVraW14IiwiYSI6ImNsZ21sMXQ2ZjA2d3Aza29sZ3Rsa2doZWcifQ.UkTPqaccmf5DuIBTLxRY3g';



export default function GetAllSpots() {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(40.7128);
  const [lng, setLng] = useState(74.0060);
  const [zoom, setZoom] = useState(4);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allSpotsThunk())
    return (() => dispatch(clearSpot()))
  }, [dispatch])

  useEffect(() => {
    if (map.current) return ; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    })
  })

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setZoom(map.current.getZoom().toFixed(2));
    });
    });

  const spots = useSelector(allSpots)

  const spotsArray = Object.values(spots);
  spotsArray.forEach(spot=> {
    if (spot.avgRating === null || spot.avgRating === "NaN") {
      spot.avgRating = "New"
    }
    else if (spot.avgRating !== "New") {
      spot.avgRating = Number(spot.avgRating).toFixed(1);
    }
  })


  return (
    <>
    <div className='get-all-spots-overall-container'>
      <div className='get-all-spots-container'>
      {spotsArray.map(spot =>  {
        return (
        <div className='get-all-spots-tile'>
          <Link to={`/spots/${spot.id}`} className='get-all-spots-link'>
          <img src={spot.previewImage} alt={`preview`} className='get-all-spots-img-tile'/>
          <div className='get-all-spots-rating-city'>
            <h3 className='get-all-spots-city-state'>{`${spot.city}, ${spot.state}`}</h3>
            <div className='get-all-spots-star-rating'>
              <i class="fa-solid fa-star" /><p className='rating-text'>{`${spot.avgRating}`}</p>
            </div>
          </div>
          <div className='get-all-spots-price-night'> ${spot.price} night </div>
          </Link>
        </div>
        )
      })}
      </div>
      <>
        <div className='get-all-spots-map-container' ref={mapContainer} />
      </>
        </div>
    </>
  )
}
