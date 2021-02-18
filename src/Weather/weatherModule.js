function weatherModule() {
  function getForecast(date, lat, lng) {
    return new Promise((resolve, reject) => {
      if (!isWeatherAvailable(date)) {
        resolve(null);
      } else {
        const parseCoord = (float) => Math.round(float * 10000) / 10000;

        const weatherGovUrl = [
          'https://api.weather.gov/points/',
          `${parseCoord(lat)},`,
          `${parseCoord(lng)}`,
        ].join('');

        fetch(weatherGovUrl)
          .then((response) => {
            //if (response.status !== 200) reject(null);
            return response.json();
          })
          .then((data) => {
            const forecastUrl = data.properties.forecast;
            fetch(forecastUrl)
              .then((response) => response.json())
              .then((data) =>
                resolve(getForecastForDate(date, data.properties.periods))
              );
          })
          .catch(() => {
            reject('Failed to retrieve forecast data');
          });
      }
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
      return elem.isDaytime && date <= elemDate && elemDate <= nextDate
        ? true
        : false;
    });
    return forecast;
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
