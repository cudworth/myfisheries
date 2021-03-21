import './Weather.css';
import { useEffect, useState } from 'react';
import { weatherModule } from './weatherModule';

const myWeather = weatherModule();
const defaultState = {
  weatherData: null,
};

function Weather(props) {
  const { date, lat, lng } = props;
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
    myWeather
      .getForecast(date, lat, lng)
      .then((data) => {
        setStateHelper({ weatherData: data });
      })
      .catch(() => {
        setStateHelper({ weatherData: null });
      });
  }, [date, lat, lng]);

  if (state.weatherData) {
    const { weatherData } = state;
    return (
      <div className="WeatherForecast">
        <div className="WeatherForecast-container">
          {`${weatherData.forecast}, ${weatherData.temperature}, ${weatherData.wind}`}
        </div>
      </div>
    );
  } else {
    return (
      <div className="WeatherForecast">
        <h3>Forecast Not Available</h3>
      </div>
    );
  }
}

export default Weather;
