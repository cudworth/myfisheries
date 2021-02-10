import { useEffect, useRef } from 'react';
import './OverlayMap.css';
import { Loader } from '@googlemaps/js-api-loader';
import { googleMapsKey } from '../private';

/* global google */

function OverlayMap(props) {
  const myRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
    });

    loader.load().then(() => {
      myRef.current = new google.maps.Map(
        document.getElementById('overlay-map'),
        {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        }
      );
    });
  }, []);

  return <div id="overlay-map" className="overlay-map"></div>;
}

export default OverlayMap;
