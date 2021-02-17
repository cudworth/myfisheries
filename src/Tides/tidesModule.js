/*
Tides module for asynchronously retrieving daily high/low tide
predictions for a given latitude and longitude.
Data provided by noaa tides and currents api.
*/

function tidesModule() {
  function getTide(station, date) {
    const startDate = new Date();
    startDate.setDate(date.getDate() - 1);

    return new Promise((resolve, reject) => {
      const dateString =
        startDate.getFullYear() +
        pad(1 + startDate.getMonth()) +
        pad(startDate.getDate());

      const url = [
        'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?',
        `station=${station.id}`,
        'format=json',
        'units=english',
        'time_zone=lst_ldt',
        'datum=MLLW',
        'interval=hilo',
        `product=${'predictions'}`,
        `begin_date=${dateString}`,
        `range=${72}`,
      ].join('&');

      fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
          resolve(parseTides(data, date));
        });
    });

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
  }

  return { getTide };
}

export { tidesModule };

// Private

function pad(n) {
  return n < 10 ? '0' + n : n;
}

// Deprecated

/*


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

*/
