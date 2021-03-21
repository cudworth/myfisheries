import './Tides.css';
import { useEffect, useState } from 'react';
import { tidesModule } from './tidesModule';

const myTides = tidesModule();

function Tides(props) {
  const { date, station } = props;
  const [state, setState] = useState({ data: null });

  function setStateHelper(obj) {
    setState((prev) => {
      const next = { ...prev };
      Object.keys(obj).forEach((key) => {
        next[key] = obj[key];
      });
      return next;
    });
  }

  useEffect(() => {
    myTides.getTide(station, date).then((data) => {
      setStateHelper({ data });
    });
  }, [date, station]);

  function deltaCard(arr, i) {
    const obj = arr[i];
    return (
      <div className="Tides-delta-card" key={`delta_key_${i}`}>
        <div>{obj.type}</div>
        <div>{obj.duration}</div>
        <div>{obj.rate}</div>
      </div>
    );
  }

  function hiloCard(arr, i) {
    const obj = arr[i];
    return (
      <div className="Tides-hilo-card" key={`hilo_key_${i}`}>
        <div>{obj.type}</div>
        <div>{obj.time}</div>
        <div>{obj.height}</div>
      </div>
    );
  }

  if (state.data) {
    const { siteName, hilo, delta } = state.data;
    const cards = [];
    let i;
    for (i = 0; i < hilo.length; i++) {
      cards.push(deltaCard(delta, i));
      cards.push(hiloCard(hilo, i));
    }
    cards.push(deltaCard(delta, hilo.length));
    return (
      <div className="Tides">
        <div>
          <h1>{`${siteName}`}</h1>
        </div>
        <div>Tide Report</div>
        <div className="Tides-container">{cards}</div>
      </div>
    );
  } else {
    return <div className="Tides">Loading Tide Report</div>;
  }
}

export default Tides;
