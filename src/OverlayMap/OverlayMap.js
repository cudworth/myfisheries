import { useEffect, useRef } from 'react';
import './OverlayMap.css';
import { Loader } from '@googlemaps/js-api-loader';
import { googleMapsKey } from '../private';

/* global google */

function OverlayMap(props) {
  const myRef = useRef(null);
  const [state, setState] = props.state;
  const stations = props.stations;

  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
    });

    loader.load().then(() => {
      myRef.current = new google.maps.Map(
        document.getElementById('overlay-map'),
        {
          center: { lat: state.map.lat, lng: state.map.lon },
          zoom: 8,
        }
      );
      renderStationMarkers();
    });
  }, []);

  function renderStationMarkers() {
    stations.forEach((station) => {
      const marker = new google.maps.Marker({
        map: myRef.current,
        position: { lat: station.lat, lng: station.lng },
        name: station.name,
        title: 'title here',
      });
    });
  }

  return <div id="overlay-map" className="overlay-map"></div>;
}

export default OverlayMap;

/*
function initMap() {
  const myLatlng = { lat: -25.363, lng: 131.044 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatlng,
  });
  const marker = new google.maps.Marker({
    position: myLatlng,
    map,
    title: "Click to zoom",
  });
  map.addListener("center_changed", () => {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(() => {
      map.panTo(marker.getPosition());
    }, 3000);
  });
  marker.addListener("click", () => {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });
}
*/
