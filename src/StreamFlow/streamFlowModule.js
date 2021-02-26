function streamFlowModule() {
  function getStreamFlow(station, date) {
    const url = [
      'https://waterservices.usgs.gov/nwis/iv/?format=json',
      'siteType=ST', //stream flow site type
      'agencyCd=USGS',
      'siteStatus=active',
      'parameterCd=00060', //stream flow parameter code
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
    const url = [
      'https://waterservices.usgs.gov/nwis/stat/?format=rdb',
      'statReportType=daily',
      'parameterCd=00060', //stream flow parameter code
      'statTypeCd=mean,p25,p50,p75', //statistics to return
      `sites=${station.i}`,
    ].join('&');

    return fetch(url)
      .then((resp) => resp.text())
      .then((text) => {
        console.log(text);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
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
