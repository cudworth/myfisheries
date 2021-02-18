import './ConditionReport.css';
import { useEffect, useState } from 'react';
import { weatherModule } from '../Weather/weatherModule';
import { tidesModule } from '../Tides/tidesModule';

const myWeather = weatherModule();
const myTides = tidesModule();

const defaultState = {
  weather: null,
  tides: null,
  riverFlows: {},
};

function ConditionReport(props) {
  const { tideStation, date } = props;
  const [state, setState] = useState({ ...defaultState });

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
    if (tideStation) {
      myWeather
        .getForecast(date, tideStation.lat, tideStation.lng)
        .then((data) => {
          console.log('forecast data: ', data);
          setStateHelper({ weather: data });
        });
    }

    /*
      myTides.getTide(tideStation, date).then((data) => {
        setStateHelper({ tides: data });
      });
      */
  }, [tideStation, date]);

  function renderTidesReport() {
    function deltaCard(arr, i) {
      const obj = arr[i];
      return (
        <div className="ConditionReport-delta-card" key={`delta_key_${i}`}>
          <div>{obj.type}</div>
          <div>{obj.duration}</div>
          <div>{obj.rate}</div>
        </div>
      );
    }

    function hiloCard(arr, i) {
      const obj = arr[i];
      return (
        <div className="ConditionReport-hilo-card" key={`hilo_key_${i}`}>
          <div>{obj.type}</div>
          <div>{obj.time}</div>
          <div>{obj.height}</div>
        </div>
      );
    }

    if (state.tides) {
      const { hilo, delta } = state.tides;
      const cards = [];
      let i;
      for (i = 0; i < hilo.length; i++) {
        cards.push(deltaCard(delta, i));
        cards.push(hiloCard(hilo, i));
      }
      cards.push(deltaCard(delta, hilo.length));
      return (
        <div className="ConditionReport">
          <div>Tide Report</div>
          <div className="ConditionReport-container">{cards}</div>
        </div>
      );
    }
  }

  return (
    <div>
      <div>Weather Report</div>
      {renderTidesReport()}
      <div></div>
    </div>
  );
}

export default ConditionReport;

/*
const [lat, lng] = [47.608013, -122.335167];

//myWeather.getWeather(lat, lng);


myTides
  .getTides(9447130, new Date(2021, 1, 11))
  .then((data) => console.log(data));
*/
