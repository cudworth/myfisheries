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
    return Promise.all([getUsgsInst(station), getUsgsStat(station)])
      .then(([inst, stat]) => processData(inst, stat, date))
      .catch((err) => console.log('Error at getStreamFlow: ', err));
  }

  function processData(inst, stat, queryDate) {
    const today = new Date();
    const [todayMonth, todayDay] = [today.getMonth() + 1, today.getDate()];

    const [queryMonth, queryDay] = [
      queryDate.getMonth() + 1,
      queryDate.getDate(),
    ];

    const instFlow = parseFloat(inst.value);

    let nLessThanInst = 0,
      nEqualToInst = 0,
      nLessThanToday = 0,
      nEqualToToday = 0,
      nLessThanQuery = 0,
      nEqualToQuery = 0,
      annualMinFlow = Infinity,
      annualMaxFlow = -Infinity,
      todayData = null,
      queryData = null;

    stat.forEach((obj) => {
      const dayNum = parseInt(obj.day_nu);
      const monthNum = parseInt(obj.month_nu);
      if (dayNum === todayDay && monthNum === todayMonth) todayData = obj;
      if (dayNum === queryDay && monthNum === queryMonth) queryData = obj;
    });

    const todaysDateFlow = parseFloat(todayData.p50_va);
    const queryDateFlow = parseFloat(queryData.p50_va);

    stat.forEach((obj) => {
      const historicMedian = parseFloat(obj.p50_va);

      if (annualMinFlow > historicMedian) annualMinFlow = historicMedian;
      if (annualMaxFlow < historicMedian) annualMaxFlow = historicMedian;

      if (historicMedian < instFlow) nLessThanInst += 1;
      if (historicMedian === instFlow) nEqualToInst += 1;

      if (historicMedian < todaysDateFlow) nLessThanToday += 1;
      if (historicMedian === todaysDateFlow) nEqualToToday += 1;

      if (historicMedian < queryDateFlow) nLessThanQuery += 1;
      if (historicMedian === queryDateFlow) nEqualToQuery += 1;
    });

    const instPercentDailyFlow = Math.round((instFlow / todaysDateFlow) * 100);

    const instPercentile = Math.round(
      ((nLessThanInst + nEqualToInst / 2) / stat.length) * 100
    );

    const todayPercentile = Math.round(
      ((nLessThanToday + nEqualToToday / 2) / stat.length) * 100
    );

    const queryPercentile = Math.round(
      ((nLessThanQuery + nEqualToQuery / 2) / stat.length) * 100
    );

    //NOTE ALL DATA RETURNED IS W.R.T. TO STATISTICAL MEDIAN FLOWRATES
    return {
      siteName: `${inst.siteName}`,
      instFlow: `${instFlow} cfs`,
      instPercentDailyFlow: `${instPercentDailyFlow}%`,
      instPercentileAnnual: `${instPercentile} percentile`,
      todaysDateFlow: `${todaysDateFlow} cfs`,
      todaysDatePercentileAnnual: `${todayPercentile} percentile`,
      queryDateFlow: `${queryDateFlow} cfs`,
      queryDatePercentileAnnual: `${queryPercentile} percentile`,
      annualMinFlow: `${annualMinFlow} cfs`,
      annualMaxFlow: `${annualMaxFlow} cfs`,
    };
  }

  return { getStreamFlow };
}

export { streamFlowModule };
