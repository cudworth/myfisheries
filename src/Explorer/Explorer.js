import { useState } from 'react';
import './Explorer.css';
import OverlayMap from '../OverlayMap/OverlayMap';
import ConditionReport from '../ConditionReport/ConditionReport';

const defaultState = {
  location: '',
  date: getDateString(),
  activeStation: null,
};

function Explorer(props) {
  const explorerState = useState({ ...defaultState });

  return (
    <div className="Explorer">
      <OverlayMap state={explorerState} />
      <ConditionReport state={explorerState} />
    </div>
  );
}

export default Explorer;

function getDateString() {
  const dateObject = new Date();
  return [
    dateObject.getFullYear(),
    pad(1 + dateObject.getMonth()),
    pad(dateObject.getDate()),
  ].join('-');

  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
}
