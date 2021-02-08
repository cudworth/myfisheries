import './App.css';
import NavigationBar from './NavigationBar/NavigationBar';
import Github from './Github/Github';
import firebaseModule from './firebaseModule';

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
