import { useState, useEffect, useRef } from 'react';
import './OverlayMap.css';
import { Loader } from '@googlemaps/js-api-loader';
import tideStations from '../Tides/tideStations.json';
import streamFlowStations from '../StreamFlow/streamFlowStations.json';
import { googleMapsKey } from '../private';

/* global google */

//const defaultState = { didMapIdle: false, didMapBoundsChange: false };

function OverlayMap(props) {
  const {
    location,
    onMapLoad,
    onTideStationClick,
    onStreamFlowStationClick,
  } = props;

  //const [state, setState] = useState({ ...defaultState });

  const ref = useRef({
    map: {},
    activeStations: {},
    renderCount: 0,
    didMapBoundsChange: false,
  });

  /*
  function setStateHelper(obj) {
    setState((prev) => {
      const next = { ...prev };
      Object.keys(obj).forEach((key) => {
        next[key] = obj[key];
      });
      return next;
    });
  }
  */

  useEffect(() => {
    const myLoader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
    });

    myLoader.load().then(() => {
      ref.current.map = new google.maps.Map(
        document.getElementById('overlay-map'),
        {
          minZoom: 10,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }
      );
      ref.current.map.addListener('bounds_changed', () => {
        ref.current.didMapBoundsChange = true;
        console.log('bound change registered');
      });
      ref.current.map.addListener('idle', () => {
        console.log('idle registered');
        if (ref.current.didMapBoundsChange && ref.current.map.getBounds()) {
          ref.current.didMapBoundsChange = false;
          updateStationMarkers();
        }
      });

      onMapLoad();
    });
  }, []);

  useEffect(() => {
    if (location) {
      mapTo(location);
    }
  }, [location]);

  function mapTo(query) {
    const myGeocoder = new google.maps.Geocoder();
    myGeocoder.geocode(
      {
        address: query,
      },
      (response) => {
        if (response.length) {
          ref.current.map.fitBounds(response[0].geometry.viewport);
        } else {
          alert(`'${query}' could not be found.`);
        }
      }
    );
  }

  function isStationInBounds(bounds, station) {
    const [bLat, bLng] = [bounds.Wa, bounds.Qa];
    const [sLat, sLng] = [station.t, station.n];
    return bLat.i < sLat && sLat < bLat.j && bLng.i < sLng && sLng < bLng.j
      ? true
      : false;
  }

  function isStationActive(key) {
    return Object.keys(ref.current.activeStations).includes(key);
  }

  function updateStationMarkers() {
    const { map, activeStations } = ref.current;
    const bounds = map.getBounds();
    console.log('bounds: ', bounds);
    const prevKeys = Object.keys(activeStations);

    // Add tide & stream flow markers within map bounds
    tideStations.forEach((station) => {
      const key = `Q${station.i}`;
      if (isStationInBounds(bounds, station) && !isStationActive(key)) {
        const marker = new google.maps.Marker({
          position: { lat: station.t, lng: station.n },
          title: 'Tide Station',
        });
        marker.addListener('click', () => {
          onTideStationClick(station);
        });
        marker.setMap(ref.current.map);
        activeStations[key] = { station, marker };
      }
    });

    streamFlowStations.forEach((station) => {
      const key = `Q${station.i}`;
      if (isStationInBounds(bounds, station) && !isStationActive(key)) {
        const marker = new google.maps.Marker({
          position: { lat: station.t, lng: station.n },
          title: 'Stream Flow Station',
        });
        marker.addListener('click', () => {
          onStreamFlowStationClick(station);
        });
        marker.setMap(ref.current.map);
        activeStations[key] = { station, marker };
      }
    });

    //Clean up any markers outside of the new bounds
    prevKeys.forEach((key) => {
      const { station, marker } = activeStations[key];
      if (!isStationInBounds(bounds, station)) {
        marker.setMap(null);
        delete activeStations[key];
      }
    });
  }

  ref.current.renderCount++;
  console.log('render count: ', ref.current.renderCount);
  return <div id="overlay-map" className="overlay-map"></div>;
}

export default OverlayMap;
