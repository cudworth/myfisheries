/*
Weather module for asynchronously retrieving daily weather
predictions for a given date, latitude, and longitude.
Data provided by weather.gov
*/

function weatherModule() {
  function getForecast(date, lat, lng) {
    if (!isWeatherAvailable(date)) {
      return Promise.reject(null);
    }

    const parseCoord = (float) => Math.round(float * 10000) / 10000;

    const weatherGovUrl = [
      'https://api.weather.gov/points/',
      `${parseCoord(lat)},`,
      `${parseCoord(lng)}`,
    ].join('');

    return fetch(weatherGovUrl)
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject(new Error(response));
        } else {
          return response.json();
        }
      })
      .then((data) => {
        const forecastUrl = data.properties.forecast;
        return fetch(forecastUrl)
          .then((response) => {
            if (response.status !== 200) {
              return Promise.reject(new Error(response));
            } else {
              return response.json();
            }
          })
          .then((data) => getForecastForDate(date, data.properties.periods));
      });
  }

  function getForecastForDate(date, data) {
    const nextDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    nextDate.setDate(1 + nextDate.getDate());
    const forecast = data.find((elem) => {
      const elemDate = new Date(elem.startTime);
      return date <= elemDate && elemDate <= nextDate ? true : false;
    });
    return parseForecast(forecast);
  }

  function parseForecast(obj) {
    return {
      icon: obj.icon,
      forecast: obj.shortForecast,
      temperature: `${obj.temperature} ${obj.temperatureUnit}`,
      wind: `${obj.windSpeed} ${obj.windDirection}`,
    };
  }

  return { getForecast };
}

export { weatherModule };

// Private

function isWeatherAvailable(date) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  end.setDate(6 + end.getDate());
  return start <= date && date <= end ? true : false;
}
