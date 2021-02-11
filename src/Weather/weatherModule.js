import { openWeatherKey } from '../private';
//import { parseCurrentWeather, parseDailyWeather } from './weatherLibrary';

function weatherModule() {
  function getWeather(lat, lon) {
    return new Promise((resolve, reject) => {
      const url = [
        'https://api.openweathermap.org/data/2.5/onecall?',
        `lat=${lat}`,
        `lon=${lon}`,
        `appid=${openWeatherKey}`,
        'exclude=current,minutely,hourly,alerts',
        'units=imperial',
      ].join('&');

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          resolve('success');
        })
        .catch(() => {
          reject('Failed to retrieve forecast data from OpenWeatherMap');
        });
    });
  }

  /*
  function renderWeather(data) {
    const current = parseCurrentWeather(data.current);

    const tempUnit = () => (imperialRadio.checked ? 'F' : 'C');
    const speedUnit = () => (imperialRadio.checked ? 'mph' : 'km/h');

    document.getElementById('weather').innerText = `${current.weather}, ${
      current.temp
    } ${tempUnit()}`;
    document.getElementById('wind').innerText = `${
      current.windSpeed
    } ${speedUnit()} ${current.windDirection} wind`;

    const iconUrl = `http://openweathermap.org/img/wn/${current.icon}@2x.png`;
    document.getElementById(`icon`).setAttribute('src', iconUrl);
  }

  function renderForecast(data) {
    const forecast = data.daily.map((obj) => {
      return parseDailyWeather(obj);
    });

    const tempUnit = () => (imperialRadio.checked ? 'F' : 'C');

    function setDaily(i, data) {
      document.getElementById(`d${i}-date`).innerText = `${data.date}`;
      document.getElementById(`d${i}-weather`).innerText = `${data.weather}, ${
        data.temp_max
      } ${tempUnit()} / ${data.temp_min} ${tempUnit()}`;

      const iconUrl = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
      document.getElementById(`d${i}-icon`).setAttribute('src', iconUrl);
    }

    forecast.slice(0, 3).forEach((day, index) => setDaily(index, day));
  }
  */

  return { getWeather };
}

export { weatherModule };
