import './ConditionReport.css';
import { useEffect, useState } from 'react';
import { weatherModule } from '../Weather/weatherModule';
import { tidesModule } from '../Tides/tidesModule';

const myWeather = weatherModule();
const myTides = tidesModule();

const defaultState = {
  weather: {},
  tides: {},
  riverFlows: {},
};

function ConditionReport(props) {
  const { tideStation, date } = props;
  const [state, setState] = useState({ ...defaultState });

  function setStateHelper(obj) {
    setState((prev) => {
      const next = { ...prev };
      Object.keys(obj).forEach((key) => {
        next[key] = obj[key];
      });
      return next;
    });
  }

  useEffect(() => {
    console.log(tideStation);
    myTides.getTides(tideStation.id, date).then((tideData) => {
      console.log('tideData ', tideData);
      setStateHelper({ tides: tideData });
    });
  }, [tideStation, date]);

  return (
    <div className="ConditionReport">
      <div>Weather Report</div>
      <div>Tide Report</div>
      <div>River Flows</div>
    </div>
  );
}

export default ConditionReport;

/*
const [lat, lng] = [47.608013, -122.335167];

//myWeather.getWeather(lat, lng);


myTides
  .getTides(9447130, new Date(2021, 1, 11))
  .then((data) => console.log(data));
*/
