function streamFlowModule() {
  function getStreamFlow(station, date) {
    const url = [
      'https://waterservices.usgs.gov/nwis/iv/?format=json',
      'siteType=ST',
      'agencyCd=USGS',
      'siteStatus=active',
      `sites=${station.i}`,
    ].join('&');
    return fetch(url)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        console.log(parseStreamFlow(data));
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  function getStatisticalStreamFlow(station, date) {
    const url = null;
  }

  function parseStreamFlow(data) {
    const timeSeries = data.value.timeSeries[0];
    const { siteName } = timeSeries.sourceInfo;
    const { value } = timeSeries.values[0].value[0];
    const { unitCode } = timeSeries.variable.unit;
    return { timeSeries, siteName, value, unitCode };
  }

  return { getStreamFlow, getStatisticalStreamFlow };
}

export { streamFlowModule };
