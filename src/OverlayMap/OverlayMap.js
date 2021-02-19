import { useState, useEffect, useRef } from 'react';
import './OverlayMap.css';
import { Loader } from '@googlemaps/js-api-loader';
import tideStations from '../Tides/tideStations.json';
import streamFlowStations from '../StreamFlow/streamFlowStations.json';
import { googleMapsKey } from '../private';

/* global google */

const defaultState = { isMapLoaded: false };

function OverlayMap(props) {
  const { location, onTideStationClick } = props;
  const [state, setState] = useState({ ...defaultState });
  const mapRef = useRef(null);

  function setStateHelper(obj) {
    setState((prev) => {
      const next = { ...prev };
      Object.keys(obj).forEach((key) => {
        next[key] = obj[key];
      });
      return next;
    });
  }

  useEffect(() => {
    const myLoader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
    });

    myLoader.load().then(() => {
      mapRef.current = new google.maps.Map(
        document.getElementById('overlay-map'),
        {}
      );
      addTideStationMarkers();
      setStateHelper({ isMapLoaded: true });
    });
  }, []);

  useEffect(() => {
    if (state.isMapLoaded) {
      mapTo(location);
    }
  }, [state.isMapLoaded, location]);

  function mapTo(query) {
    const myGeocoder = new google.maps.Geocoder();
    myGeocoder.geocode(
      {
        address: query,
      },
      (response) => {
        if (response.length) {
          mapRef.current.fitBounds(response[0].geometry.viewport);
        } else {
          alert(`'${query}' could not be found.`);
        }
      }
    );
  }

  function addTideStationMarkers() {
    tideStations.forEach((station) => {
      const marker = new google.maps.Marker({
        position: { lat: station.t, lng: station.n },
        title: station.i,
      });

      marker.setMap(mapRef.current);

      google.maps.event.addListener(marker, 'click', () => {
        onTideStationClick(station);
      });
    });
  }

  return <div id="overlay-map" className="overlay-map"></div>;
}

export default OverlayMap;
