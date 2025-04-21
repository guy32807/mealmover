import React, { useState, useEffect } from 'react';
import { FaLocationArrow, FaSearch } from 'react-icons/fa';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';
import './LocationFinder.css';

const LocationFinder = ({ onLocationChange }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use browser geolocation API to get current position
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationChange({ lat: latitude, lng: longitude });
        // Reverse geocoding to get address
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
          .then(response => response.json())
          .then(data => {
            if (data.results && data.results.length > 0) {
              setAddress(data.results[0].formatted_address);
            }
          })
          .catch(err => console.error('Error reverse geocoding:', err))
          .finally(() => setLoading(false));
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  
  const handleSelect = async (selectedAddress) => {
    setLoading(true);
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      setAddress(selectedAddress);
      onLocationChange(latLng);
    } catch (error) {
      setError('Error finding that location');
      console.error('Error selecting address:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="location-finder">
      <h3>Find Restaurants Near You</h3>
      <div className="location-controls">
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading: placesLoading }) => (
            <div className="autocomplete-container">
              <div className="input-wrapper">
                <input
                  {...getInputProps({
                    placeholder: 'Enter your location',
                    className: 'location-input',
                  })}
                />
                <button onClick={getCurrentLocation} disabled={loading}>
                  <FaLocationArrow />
                </button>
              </div>
              
              <div className="autocomplete-dropdown-container">
                {placesLoading && <div className="suggestion-item">Loading...</div>}
                {suggestions.map((suggestion, index) => {
                  const className = suggestion.active
                    ? 'suggestion-item active'
                    : 'suggestion-item';
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, { className })}
                      key={index}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-indicator">Finding location...</div>}
      </div>
    </div>
  );
};

export default LocationFinder;