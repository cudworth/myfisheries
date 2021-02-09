import './App.css';
import NavigationBar from './NavigationBar/NavigationBar';
import Github from './Github/Github';
import firebaseModule from './firebaseModule';
import { useState } from 'react';

const defaultState = { user: null };
const firebase = firebaseModule();

function App() {
  const appState = useState({ ...defaultState });
  const [state, setState] = appState;

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
