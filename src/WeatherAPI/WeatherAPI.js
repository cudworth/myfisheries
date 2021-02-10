import { openWeatherKey } from '../private';
import { parseCurrentWeather, parseDailyWeather } from './weatherLibrary';

const searchText = document.getElementById('input-text');
const submitBtn = document.getElementById('input-btn');
let query = searchText.value;

const imperialRadio = document.getElementById('radio-imperial');
imperialRadio.checked = true;

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  searchWeather();
});

searchText.addEventListener('input', (e) => {
  query = searchText.value;
});

function searchWeather() {
  getLatLon()
    .then((loc) => {
      getWeather(loc);
    })
    .then(
      () => {
        document.getElementById('content').classList.remove('hidden');
      },
      (reject) => {
        console.error(`An error has occured: ${reject}`);
        document.getElementById('content').classList.add('hidden');
      }
    );
}

function getLatLon() {
  return new Promise((resolve, reject) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${openWeatherKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        return { lat, lon };
      })
      .then(
        (loc) => resolve(loc),
        (error) => reject('Failed to locate city on OpenWeatherMap')
      );
  });
}

function getWeather(coords) {
  return new Promise((resolve, reject) => {
    const { lat, lon } = coords;
    const units = () => (imperialRadio.checked ? 'imperial' : 'metric');

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units()}&appid=${openWeatherKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        renderWeather(data);
        renderForecast(data);
        resolve('success');
      })
      .catch(() => {
        reject('Failed to retrieve forecast data from OpenWeatherMap');
      });
  });
}

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
