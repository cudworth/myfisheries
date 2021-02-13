import { useEffect, useRef, useState } from 'react';
import './OverlayMap.css';
import { Loader } from '@googlemaps/js-api-loader';
import tideStations from '../Tides/tideStations.json';
import { googleMapsKey } from '../private';

/* global google */

const defaultState = {
  location: '',
  date: getDateString(),
};

function OverlayMap(props) {
  const [appState, setAppState] = props.state;
  const [state, setState] = useState({ ...defaultState });
  const myRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
    });

    loader
      .load()
      .then(() => {
        myRef.current = new google.maps.Map(
          document.getElementById('overlay-map'),
          {
            //default attributes here
          }
        );
        addTideStationMarkers();
        mapTo('Tacoma, Washington');
      })
      .then(() => {});
  }, []);

  function mapTo(query) {
    const myGeocoder = new google.maps.Geocoder();
    myGeocoder.geocode(
      {
        address: query,
      },
      (response) => {
        if (response.length) {
          myRef.current.fitBounds(response[0].geometry.viewport);
        } else {
          alert(`${state.location} could not be found.`);
        }
      }
    );
  }

  function addTideStationMarkers() {
    tideStations.stations.forEach((station) => {
      const marker = new google.maps.Marker({
        map: myRef.current,
        position: { lat: station.lat, lng: station.lng },
        name: station.name,
        title: 'title here',
      });
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    mapTo(state.location);
  }

  function handleChange(attribute, value) {
    setState((prev) => {
      const next = { ...prev };
      next[attribute] = value;
      return next;
    });
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>
          Location Search
          <input
            type="text"
            placeholder="Tacoma, WA"
            value={state.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={state.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </label>
      </form>
      <div id="overlay-map" className="overlay-map"></div>
    </div>
  );
}

export default OverlayMap;

function getDateString() {
  const dateObject = new Date();
  return [
    dateObject.getFullYear(),
    pad(1 + dateObject.getMonth()),
    pad(dateObject.getDate()),
  ].join('-');

  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
}
