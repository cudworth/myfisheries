import './App.css';
import OverlayMap from './OverlayMap/OverlayMap';
import NavigationBar from './NavigationBar/NavigationBar';
import Github from './Github/Github';

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <NavigationBar />
        <Github />
      </div>
    </div>
  );
}

export default App;
