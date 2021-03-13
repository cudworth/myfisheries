import './ConditionReport.css';
import { useEffect, useState } from 'react';
import { weatherModule } from '../Weather/weatherModule';
import { tidesModule } from '../Tides/tidesModule';
import { streamFlowModule } from '../StreamFlow/streamFlowModule';

const myWeather = weatherModule();
const myTides = tidesModule();
const myStreamFlow = streamFlowModule();

const defaultState = {
  weatherData: null,
  tideData: null,
  streamFlowData: null,
};

function ConditionReport(props) {
  const { date, tideStation, streamFlowStation } = props;
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
    const getWeather = (date, lat, lng) => {
      myWeather
        .getForecast(date, lat, lng)
        .then((data) => {
          setStateHelper({ weatherData: data });
        })
        .catch(() => {
          setStateHelper({ weatherData: null });
        });
    };

    if (tideStation) {
      getWeather(date, tideStation.t, tideStation.n);
      myTides.getTide(tideStation, date).then((data) => {
        setStateHelper({ tideData: data });
      });
    }

    if (streamFlowStation) {
      getWeather(date, streamFlowStation.t, streamFlowStation.n);
      myStreamFlow.getStreamFlow(streamFlowStation, date).then((data) => {
        setStateHelper({ streamFlowData: data });
      });
    }
  }, [date, tideStation, streamFlowStation]);

  function renderDate() {
    if (tideStation || streamFlowStation) {
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

  function renderWeather() {
    if ((tideStation || streamFlowStation) && state.weatherData) {
      const { weatherData } = state;
      return (
        <div className="WeatherForecast">
          <div className="WeatherForecast-container">
            {`${weatherData.forecast}, ${weatherData.temperature}, ${weatherData.wind}`}
          </div>
        </div>
      );
    } else if ((tideStation || streamFlowStation) && !state.weatherData) {
      return (
        <div className="WeatherForecast">
          <h3>Forecast Not Available</h3>
        </div>
      );
    }
  }

  function renderTides() {
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

    if (tideStation && state.tideData) {
      const { siteName, hilo, delta } = state.tideData;
      const cards = [];
      let i;
      for (i = 0; i < hilo.length; i++) {
        cards.push(deltaCard(delta, i));
        cards.push(hiloCard(hilo, i));
      }
      cards.push(deltaCard(delta, hilo.length));
      return (
        <div className="ConditionReport">
          <div>
            <h1>{`${siteName}`}</h1>
          </div>
          <div>Tide Report</div>
          <div className="ConditionReport-container">{cards}</div>
        </div>
      );
    }
  }

  function renderStreamFlow() {
    if (streamFlowStation && state.streamFlowData) {
      const { siteName } = state.streamFlowData;
      console.log(state.streamFlowData);
      return (
        <div className="ConditionReport">
          <div>
            <h1>{`${siteName}`}</h1>
          </div>
          <div>Stream flow report here</div>
        </div>
      );
    }
  }

  return (
    <div>
      {renderDate()}
      {renderWeather()}
      {renderTides()}
      {renderStreamFlow()}
    </div>
  );
}

export default ConditionReport;
