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
    activeMarkers: [],
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
        updateMarkers();
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

  function purgeMarkers() {
    ref.current.activeMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    ref.current.activeMarkers.length = 0;
  }

  function updateMarkers() {
    const bounds = ref.current.map.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    const center = ref.current.map.getCenter();
    const [centerLat, centerLng] = [center.lat(), center.lng()];

    const maxRadius =
      ((northEast.lat() - southWest.lat()) / 2) ** 2 +
      ((northEast.lng() - southWest.lng()) / 2) ** 2;

    purgeMarkers();

    addMarkers(tideStations, onTideStationClick);
    addMarkers(streamFlowStations, onStreamFlowStationClick);

    function addMarkers(stationList, onClick) {
      stationList.forEach((station) => {
        const radius =
          (station.t - centerLat) ** 2 + (station.n - centerLng) ** 2;
        if (radius < maxRadius) {
          const marker = new google.maps.Marker({
            position: { lat: station.t, lng: station.n },
          });
          marker.addListener('click', () => {
            onClick(station);
          });
          marker.setMap(ref.current.map);
          ref.current.activeMarkers.push(marker);
        }
      });
    }
  }
  return <div id="overlay-map" className="overlay-map"></div>;
}

export default OverlayMap;
