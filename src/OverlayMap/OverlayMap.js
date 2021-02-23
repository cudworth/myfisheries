import { useEffect, useRef } from 'react';
import './OverlayMap.css';
import { Loader } from '@googlemaps/js-api-loader';
import tideStations from '../Tides/tideStations.json';
import streamFlowStations from '../StreamFlow/streamFlowStations.json';
import { googleMapsKey } from '../private';

/* global google */

function OverlayMap(props) {
  const { location, onTideStationClick, onStreamFlowStationClick } = props;

  const ref = useRef({
    map: null,
    geocoder: null,
    activeStations: {},
  });

  useEffect(() => {
    const myLoader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
    });

    myLoader.load().then(() => {
      ref.current.map = new google.maps.Map(
        document.getElementById('overlay-map'),
        {
          center: { lat: 47.2528768, lng: -122.4442906 },
          zoom: 10,
          minZoom: 10,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }
      );

      ref.current.map.addListener('idle', () => {
        updateStationMarkers();
      });

      ref.current.geocoder = new google.maps.Geocoder();
    });
  }, []);

  useEffect(() => {
    if (location) {
      console.log('MapTo effect triggered');
      mapTo(location);
    }
  }, [location]);

  function mapTo(query) {
    ref.current.geocoder.geocode(
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

  function sortStationsByProximity(stations) {
    const center = ref.current.map.getCenter();
    const [t, n] = [center.lat(), center.lng()];

    // temporary array holds objects with position and sort-value
    const mapped = stations.map((station, index) => {
      return { i: index, v: (station.t - t) ** 2 + (station.n - n) ** 2 };
    });

    // sorting the mapped array containing the reduced values
    mapped.sort(function (a, b) {
      return a.v - b.v;
    });

    // container for the resulting order
    return mapped.map((elem) => {
      return stations[elem.i];
    });
  }

  function purgeMarkers() {
    const bounds = ref.current.map.getBounds();
    Object.keys(ref.current.activeStations).forEach((key) => {
      const { s, m } = ref.current.activeStations[key];
      if (!isStationInBounds(bounds, s)) {
        m.setMap(null);
        delete ref.current.activeStations[key];
      }
    });
  }

  function addMarkers(stationList, onClick) {
    const bounds = ref.current.map.getBounds();
    for (let i = 0; i < stationList.length; i++) {
      const s = stationList[i];
      const key = `q${s.i}`;
      if (isStationInBounds(bounds, s)) {
        if (!isStationActive(key)) {
          const m = new google.maps.Marker({
            position: { lat: s.t, lng: s.n },
          });
          m.addListener('click', () => {
            onClick(s);
          });
          m.setMap(ref.current.map);
          ref.current.activeStations[key] = { s, m };
        }
      } else {
        break;
      }
    }
  }

  function updateStationMarkers() {
    const sortedTideStations = sortStationsByProximity(tideStations);
    const sortedStreamFlowStations = sortStationsByProximity(
      streamFlowStations
    );

    //remove all currently attached stations
    purgeMarkers();

    // Add tide & stream flow markers within map bounds
    addMarkers(sortedTideStations, onTideStationClick);
    addMarkers(sortedStreamFlowStations, onStreamFlowStationClick);
  }

  return <div id="overlay-map" className="overlay-map"></div>;
}

export default OverlayMap;

/*

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

*/
