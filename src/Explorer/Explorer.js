import { useState } from 'react';
import './Explorer.css';
import OverlayMap from '../OverlayMap/OverlayMap';
import ConditionReport from '../ConditionReport/ConditionReport';

const defaultState = {
  location: 'Tacoma, WA',
  inputText: '',
  date: getDateString(),
  activeStation: null,
};

function Explorer(props) {
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

  return (
    <div className="Explorer">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setStateHelper({
            location: state.inputText,
            inputText: '',
          });
        }}
      >
        <label>
          <input
            type="text"
            placeholder="Location Search"
            value={state.inputText}
            onChange={(e) => setStateHelper({ inputText: e.target.value })}
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={state.date}
            onChange={(e) => setStateHelper({ date: e.target.value })}
          />
        </label>
      </form>
      <OverlayMap
        location={state.location}
        onStationClick={(station) => console.log(station)}
      />
      <ConditionReport />
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
