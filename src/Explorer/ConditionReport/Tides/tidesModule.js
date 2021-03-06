/*
Tides module for asynchronously retrieving daily high/low tide
predictions for a given latitude and longitude.
Data provided by noaa tides and currents api.
*/

function tidesModule() {
  function getStationMetaData(station) {
    const url = [
      'https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/',
      `${station.i}`,
      '.json',
    ].join('');

    return fetch(url)
      .then((resp) => resp.json())
      .then((data) => data)
      .catch((reason) => {
        return Promise.reject(reason);
      });
  }

  function getStationPredictions(station, date) {
    const startDate = new Date();
    startDate.setDate(date.getDate() - 1);

    const dateString =
      startDate.getFullYear() +
      pad(1 + startDate.getMonth()) +
      pad(startDate.getDate());

    const url = [
      'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?',
      `station=${station.i}`,
      'format=json',
      'units=english',
      'time_zone=lst_ldt',
      'datum=MLLW',
      'interval=hilo',
      `product=${'predictions'}`,
      `begin_date=${dateString}`,
      `range=${3 * 24}`,
    ].join('&');

    return fetch(url)
      .then((resp) => resp.json())
      .then((data) => parseTides(data, date))
      .catch((reason) => {
        return Promise.reject(reason);
      });
  }

  function getTide(station, date) {
    return Promise.all([
      getStationMetaData(station),
      getStationPredictions(station, date),
    ])
      .then(([metadata, predictions]) => {
        return { ...predictions, siteName: metadata.stations[0].name };
      })
      .catch((reason) => Promise.reject(reason));
  }

  function parseTides(data, date) {
    const tides = data.predictions;
    const hilo = [];
    const delta = [];
    for (let i = 1; i < tides.length; i++) {
      const prevTide = tides[i - 1];
      const prevDate = new Date(tides[i - 1].t);
      const nextTide = tides[i];
      const nextDate = new Date(tides[i].t);

      if (nextDate.getDate() === date.getDate()) {
        hilo.push({
          type: 'H' === nextTide.type ? 'High' : 'Low',
          time: `${nextDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          height: `${Math.floor(parseFloat(nextTide.v) * 10) / 10} ft`,
        });
        delta.push(diff({ prevTide, prevDate, nextTide, nextDate }));
      } else if (prevDate.getDate() === date.getDate()) {
        delta.push(diff({ prevTide, prevDate, nextTide, nextDate }));
      }
    }
    return { hilo, delta };

    function diff(args) {
      const { prevTide, prevDate, nextTide, nextDate } = args;
      const dh = Math.round((nextTide.v - prevTide.v) * 10) / 10;
      const dtHrs = (nextDate - prevDate) / 1000 / 60 / 60;
      const dt = { h: Math.floor(dtHrs), m: Math.floor(60 * (dtHrs % 1)) };
      const dhdt = Math.round((dh / dtHrs) * 10) / 10;
      const type = 1 === Math.sign(dh) ? 'Rising' : 'Falling';
      const duration = `${dt.h} h ${dt.m} m`;
      const rate = `${dh} ft (${dhdt} ft/h)`;
      return { type, duration, rate };
    }
  }

  return { getTide };
}

export { tidesModule };

// Private

function pad(n) {
  return n < 10 ? '0' + n : n;
}
