import './App.css';
import NavigationBar from './NavigationBar/NavigationBar';
import Github from './Github/Github';
import firebaseModule from './firebaseModule';
import OverlayMap from './OverlayMap/OverlayMap';
import { useState } from 'react';
import tideStations from './tideStations.json';

import { tidesModule } from './Tides/tidesModule';
import { weatherModule } from './Weather/weatherModule';

/*
const [lat, lng] = [47.608013, -122.335167];

const weather = weatherModule();
//weather.getWeather(lat, lng);

const tides = tidesModule();
tides.getNearestStation(lat, lng).then((data) => console.log(data));

tides
  .getTides(9447130, new Date(2021, 1, 11))
  .then((data) => console.log(data));
*/

const defaultState = { user: null };
const firebase = firebaseModule();

function App() {
  const appState = useState({ ...defaultState });
  //const [state, setState] = appState;

  return (
    <div className="App">
      <div className="App-container">
        <NavigationBar state={appState} firebase={firebase} />
        <OverlayMap state={appState} stations={tideStations.stations} />
        <Github />
      </div>
    </div>
  );
}

export default App;

//<OverlayMap state={appState} stations={tideStations.stations} />
