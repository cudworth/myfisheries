import './ConditionReport.css';
import { useEffect, useState } from 'react';
import { weatherModule } from '../Weather/weatherModule';
import { tidesModule } from '../Tides/tidesModule';
import { streamFlowModule } from '../StreamFlow/streamFlowModule';

const myWeather = weatherModule();
const myTides = tidesModule();
const myStreamFlow = streamFlowModule();

myStreamFlow.getStreamFlow({ i: 'USGS:02339495' });

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
        .getForecast(date, tideStation.t, tideStation.n)
        .then((data) => {
          setStateHelper({ weather: data });
        })
        .catch(() => {
          setStateHelper({ weather: null });
        });

      myTides.getTide(tideStation, date).then((data) => {
        setStateHelper({ tides: data });
      });
    }
  }, [tideStation, date]);

  function renderStation() {
    if (tideStation) {
      return (
        <div>
          <h1>{`${tideStation.i}`}</h1>
        </div>
      );
    }
  }

  function renderDate() {
    if (tideStation) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      return (
        <div>
          <h2>{date.toLocaleString('en-US', options)}</h2>
        </div>
      );
    }
  }

  function renderWeatherForecast() {
    if (tideStation && state.weather) {
      const { weather } = state;
      return (
        <div className="WeatherForecast">
          <div className="WeatherForecast-container">
            {`${weather.forecast}, ${weather.temperature}, ${weather.wind}`}
          </div>
        </div>
      );
    } else if (tideStation && !state.weather) {
      return (
        <div className="WeatherForecast">
          <h3>Forecast Not Available</h3>
        </div>
      );
    }
  }

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
      {renderStation()}
      {renderDate()}
      {renderWeatherForecast()}
      {renderTidesReport()}
    </div>
  );
}

export default ConditionReport;
