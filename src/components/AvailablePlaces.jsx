import Places from './Places.jsx';
import { useState, useEffect } from 'react';
import ErrorPage from './Error.jsx';
import {sortPlacesByDistance} from "../loc.js"
import {fetchAvailablePlaces} from "../http.js"


export default function AvailablePlaces({ onSelectPlace }) {

  const [isFetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [error, setError] = useState()

  useEffect(()=>{
    setIsFetching(true)
    async function fetchPlaces(){
      try{
        const places = await fetchAvailablePlaces()

        navigator.geolocation.getCurrentPosition((position)=>{
          const sortedPlaces   = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude)
          setAvailablePlaces(sortedPlaces)
          setIsFetching(false)
        })

        
      } catch (error){
        setError({message: error.message || "Coun't fetch places, please try again later"})
        setIsFetching(false)
      }      
      
    }

    fetchPlaces()

  },[])

  if(error){
      return (
        <ErrorPage title="An Error Occured & component showing" message={error.message} />
      )
  }
  

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadtingText="Fetching Place Data ..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
