import './ConditionReport.css';
import { useState } from 'react';
import { weatherModule } from '../Weather/weatherModule';
import { tidesModule } from '../Tides/tidesModule';

const defaultState = {};

function ConditionReport(props) {
  const [state, setState] = useState({ ...defaultState });
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

const weather = weatherModule();
//weather.getWeather(lat, lng);

const tides = tidesModule();
tides.getNearestStation(lat, lng).then((data) => console.log(data));

tides
  .getTides(9447130, new Date(2021, 1, 11))
  .then((data) => console.log(data));
*/
