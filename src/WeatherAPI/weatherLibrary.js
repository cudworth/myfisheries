function parseTime(obj) {
  const date = new Date(obj * 1000);
  const meri = date.getHours() < 12 ? 'a.m.' : 'p.m.';

  const hours = 13 < date.getHours() ? 24 - date.getHours() : date.getHours();
  return `${hours}:${date.getMinutes()} ${meri}`;
}

function parseDay(obj) {
  const date = new Date(obj * 1000);
  const options = { weekday: 'long' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function parseCurrentWeather(obj) {
  return {
    icon: obj.weather[0].icon,
    time: parseTime(obj.dt),
    temp: Math.floor(obj.temp * 10) / 10,
    weather: obj.weather[0].main,
    windDirection: windDirection(obj.wind_deg),
    windSpeed: Math.floor(obj.wind_speed),
  };
}

function parseDailyWeather(obj) {
  return {
    icon: obj.weather[0].icon,
    date: parseDay(obj.dt),
    temp_min: Math.floor(obj.temp.min),
    temp_max: Math.floor(obj.temp.max),
    weather: obj.weather[0].main,
  };
}

function windDirection(D) {
  switch (true) {
    case (348.75 <= D && D <= 360) || (0 <= D && D <= 11.25):
      return 'N';
    case D < 33.75:
      return 'NNE';
    case D < 56.25:
      return 'NE';
    case D < 78.75:
      return 'ENE';
    case D < 101.25:
      return 'E';
    case D < 123.75:
      return 'ESE';
    case D < 146.25:
      return 'SE';
    case D < 168.75:
      return 'SSE';
    case D < 191.25:
      return 'S';
    case D < 213.75:
      return 'SSW';
    case D < 236.25:
      return 'SW';
    case D < 258.75:
      return 'WSW';
    case D < 281.25:
      return 'W';
    case D < 303.75:
      return 'WNW';
    case D < 326.25:
      return 'NW';
    case D < 348.75:
      return 'NNW';
    default:
      return false;
  }
}

export {
  parseTime,
  parseDay,
  parseDailyWeather,
  parseCurrentWeather,
  windDirection,
};
