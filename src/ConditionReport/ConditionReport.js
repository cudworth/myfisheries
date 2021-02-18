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
          setStateHelper({ weather: data });
        })
        .catch((resp) => {
          setStateHelper({ weather: null });
        });

      myTides.getTide(tideStation, date).then((data) => {
        setStateHelper({ tides: data });
      });
    }
  }, [tideStation, date]);

  function renderWeatherForecast() {
    if (tideStation && state.weather) {
      const { weather } = state;
      return (
        <div className="WeatherForecast">
          <div>Weather Report</div>
          <img src={weather.icon} alt="icon" />
          <div>{weather.forecast}</div>
          <div>{weather.temperature}</div>
          <div>{weather.wind}</div>
        </div>
      );
    } else if (tideStation && !state.weather) {
      return (
        <div className="WeatherForecast">
          <div>
            Weather forecast is not available for the selected station and date.
          </div>
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
      {renderWeatherForecast()}
      {renderTidesReport()}
    </div>
  );
}

export default ConditionReport;
