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
        const parsedData = parseStatisticalStreamFlow(text);
        console.log(getStatsOnDate(parsedData, date));
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

  function parseStatisticalStreamFlow(text) {
    const textLines = text.split('\n');
    const rawData = [];
    textLines.forEach((textLine) => {
      const items = textLine.split('\t');
      if (10 < items.length) {
        rawData.push(items);
      }
    });
    const keys = rawData[0];
    const collection = [];
    for (let i = 1; i < rawData.length; i++) {
      //start on line #2, #1 is not useful data
      const dailyInfo = {};
      keys.forEach((key, index) => {
        dailyInfo[key] = rawData[i][index];
      });
      collection.push(dailyInfo);
    }
    return collection;
  }

  function getStatsOnDate(data, date) {
    const monthNum = date.getMonth() + 1;
    const dayNum = date.getDay();
    return data.find((obj, index) => {
      return parseFloat(obj.day_nu) === dayNum &&
        parseFloat(obj.month_nu) === monthNum
        ? true
        : false;
    });
  }

  return { getStreamFlow, getStatisticalStreamFlow };
}

export { streamFlowModule };
