/*
Tides module for asynchronously retrieving 7 day tide predictions for a given latitude and longitude.
Data provided by noaa tides and currents api.
*/

function tidesModule() {
  function getTides(stationID, dateObject) {
    return new Promise((resolve, reject) => {
      const dateString =
        dateObject.getFullYear() +
        pad(1 + dateObject.getMonth()) +
        pad(dateObject.getDate());

      const url = [
        'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?',
        `station=${stationID}`,
        'format=json',
        'units=english',
        'time_zone=lst_ldt',
        'datum=MSL',
        'interval=hilo',
        `product=${'predictions'}`,
        `begin_date=${dateString}`,
        `range=${24}`,
      ].join('&');

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.predictions);
        });
    });
  }

  function getStations() {
    return new Promise((resolve, reject) => {
      const url = [
        'https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?',
        'type=tidepredictions',
      ].join('&');

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.stations);
        });
    });
  }

  function getNearestStation(lat, lon) {
    return new Promise((resolve, reject) => {
      const url = [
        'https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?',
        'type=tidepredictions',
      ].join('&');

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const nearestStation = data.stations.reduce(
            (nearest, station) => {
              const relDist =
                (station.lat - lat) ** 2 + (station.lng - lon) ** 2;
              if (relDist < nearest.relDist) {
                nearest = { relDist, station };
              }
              return nearest;
            },
            { relDist: Infinity, station: null }
          ).station;
          resolve(nearestStation);
        });
    });
  }

  return { getTides, getStations, getNearestStation };
}

function pad(n) {
  return n < 10 ? '0' + n : n;
}

export { tidesModule };

/*
DEPRECATED

function tidesModule() {
  function getTides(lat, lon) {
    return new Promise((resolve, reject) => {
      getNearestStation(lat, lon).then((station) => {
        const now = new Date(Date.now());
        const startDate =
          now.getFullYear() + pad(1 + now.getMonth()) + pad(now.getDate());

        const url = [
          'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?',
          `station=${station.id}`,
          'format=json',
          'units=english',
          'time_zone=lst_ldt',
          'datum=MSL',
          'interval=hilo',
          `product=${'predictions'}`,
          `begin_date=${startDate}`,
          `range=${24 * 7}`,
        ].join('&');

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            resolve(data);
          });
      });
    });
  }

  function getNearestStation(lat, lon) {
    return new Promise((resolve, reject) => {
      const url = [
        'https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?',
        'type=tidepredictions',
      ].join('&');

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const nearestStation = data.stations.reduce(
            (nearest, station) => {
              const relDist =
                (station.lat - lat) ** 2 + (station.lng - lon) ** 2;
              if (relDist < nearest.relDist) {
                nearest = { relDist, station };
              }
              return nearest;
            },
            { relDist: Infinity, station: null }
          ).station;
          resolve(nearestStation);
        });
    });
  }

  return { getTides };
}

function pad(n) {
  return n < 10 ? '0' + n : n;
}
*/
