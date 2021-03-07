function streamFlowModule() {
  function getUsgsInst(station) {
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
        return parseInst(data);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  function parseInst(data) {
    const timeSeries = data.value.timeSeries[0];
    const { siteName } = timeSeries.sourceInfo;
    const { value } = timeSeries.values[0].value[0];
    const { unitCode } = timeSeries.variable.unit;
    return { timeSeries, siteName, value, unitCode };
  }

  function getUsgsStat(station) {
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
        return parseStat(text);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  function parseStat(text) {
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
    for (let i = 2; i < rawData.length; i++) {
      //start on line index #2, 0 & 1 are keynames & units
      const dailyInfo = {};
      keys.forEach((key, index) => {
        dailyInfo[key] = rawData[i][index];
      });
      collection.push(dailyInfo);
    }
    return collection;
  }

  function getStreamFlow(station, date = new Date()) {
    Promise.all([getUsgsInst(station), getUsgsStat(station)])
      .then(([inst, stat]) => {
        console.log('instantaneous: ', inst);
        console.log('statistics: ', stat);
        console.log(processData(inst, stat, date));
      })
      .catch((err) => console.log('Error at getStreamFlow: ', err));
  }

  function processData(instData, statData, date) {
    /*
    - Current flow
    - Annual maximum flow
    - Annual minimum flow
    - Percent of mean daily flow
    - Percentile of annual stream flows
    */

    const dayStats = getDailyStats(statData, date);
    const yearStats = getAnnualStats(statData, instData.value);

    let annualMax, annualMin, annualPercentile;

    return {
      currentFlow: `${instData.value} ${instData.unitCode}`,
      percentDailyP50: `${Math.round(
        (instData.value / dayStats.p50_va) * 100
      )}% median daily flow`,
      annualMax: `${yearStats.annualMaxP50} cfs`,
      annualMin: `${yearStats.annualMinP50} cfs`,
      annualPercentile: `${yearStats.percentileAnnualP50}% annual median range`,
    };
  }

  function getDailyStats(data, date) {
    const monthNum = date.getMonth() + 1;
    const dayNum = date.getDate();
    return data.find((obj) => {
      return parseInt(obj.day_nu) === dayNum &&
        parseInt(obj.month_nu) === monthNum
        ? true
        : false;
    });
  }

  function getAnnualStats(data, instFlow) {
    const flow = parseFloat(instFlow);
    let nLess = 0,
      nEq = 0,
      min = Infinity,
      max = -Infinity;

    data.forEach((obj) => {
      const refFlow = parseFloat(obj.p50_va);
      if (min > refFlow) min = refFlow;
      if (max < refFlow) max = refFlow;
      if (refFlow < flow) nLess += 1;
      if (refFlow === flow) nEq += 1;
    });

    const percentile = Math.round(((nLess + nEq / 2) / data.length) * 100);

    return {
      annualMinP50: min,
      annualMaxP50: max,
      percentileAnnualP50: percentile,
    };
  }

  return { getStreamFlow };
}

export { streamFlowModule };
