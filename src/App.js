import './App.css';
import NavigationBar from './NavigationBar/NavigationBar';
import Github from './Github/Github';
import firebaseModule from './firebaseModule';
import { useState } from 'react';

import { tidesModule } from './Tides/tidesModule';
import { weatherModule } from './Weather/weatherModule';

const [lat, lon] = [47.608013, -122.335167];
const weather = weatherModule();
//weather.getWeather(lat, lon);

const tides = tidesModule();
tides.getTides(lat, lon).then((data) => console.log(data));

const defaultState = { user: null };
const firebase = firebaseModule();

function App() {
  const appState = useState({ ...defaultState });
  //const [state, setState] = appState;

  return (
    <div className="App">
      <div className="App-container">
        <NavigationBar state={appState} firebase={firebase} />
        <Github />
      </div>
    </div>
  );
}

export default App;
