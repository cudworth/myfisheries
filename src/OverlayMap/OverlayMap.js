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

  function isStationInRadius(bounds, radius) {
    const [lat, lng] = [bounds.Wa, bounds.Qa];
    const maxRadius = Math.floor(
      (((lat.j - lat.i) / 2) ** 2 + ((lng.j - lng.i) / 2) ** 2) * 1000
    );
    return radius < maxRadius;
  }

  function isStationActive(key) {
    return Object.keys(ref.current.activeStations).includes(key);
  }

  function sortStationsByProximity(stations, ctrLat, ctrLng) {
    const mapped = stations.map((station, index) => {
      return {
        index,
        radius: Math.floor(
          ((station.t - ctrLat) ** 2 + (station.n - ctrLng) ** 2) * 1000
        ),
      };
    });

    mapped.sort((a, b) => a.radius - b.radius);

    return mapped.map((elem) => {
      return { station: stations[elem.index], radius: elem.radius };
    });
  }

  function purgeMarkers(bounds) {
    Object.keys(ref.current.activeStations).forEach((key) => {
      const { marker, radius } = ref.current.activeStations[key];
      if (!isStationInRadius(bounds, radius)) {
        marker.setMap(null);
        delete ref.current.activeStations[key];
      }
    });
  }

  function addMarkers(bounds, stationList, onClick) {
    for (let i = 0; i < stationList.length; i++) {
      const { station, radius } = stationList[i];

      const key = `q${station.i}`;
      if (isStationInRadius(bounds, radius)) {
        if (!isStationActive(key)) {
          const marker = new google.maps.Marker({
            position: { lat: station.t, lng: station.n },
          });
          marker.addListener('click', () => {
            onClick(station);
          });
          marker.setMap(ref.current.map);
          ref.current.activeStations[key] = { station, marker, radius };
        }
      } else {
        break;
      }
    }
  }

  function updateStationMarkers() {
    const bounds = ref.current.map.getBounds();
    const center = ref.current.map.getCenter();
    const [centerLat, centerLng] = [center.lat(), center.lng()];

    const sortedTideStations = sortStationsByProximity(
      tideStations,
      centerLat,
      centerLng
    );
    const sortedStreamFlowStations = sortStationsByProximity(
      streamFlowStations,
      centerLat,
      centerLng
    );

    purgeMarkers(bounds);

    addMarkers(bounds, sortedTideStations, onTideStationClick);
    addMarkers(bounds, sortedStreamFlowStations, onStreamFlowStationClick);
  }
  return <div id="overlay-map" className="overlay-map"></div>;
}

export default OverlayMap;
