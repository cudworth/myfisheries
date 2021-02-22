import { useState } from 'react';
import './Explorer.css';
import OverlayMap from '../OverlayMap/OverlayMap';
import ConditionReport from '../ConditionReport/ConditionReport';

const defaultState = {
  location: null,
  inputText: '',
  htmlDate: getHtmlDate(),
  date: getDate(),
  tideStation: null,
  streamFlowStation: null,
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
            value={state.htmlDate}
            onChange={(e) =>
              setStateHelper({
                htmlDate: e.target.value,
                date: getDate(e.target.value),
              })
            }
          />
        </label>
      </form>
      <OverlayMap
        location={state.location}
        onMapLoad={() => {
          setStateHelper({ location: 'Tacoma, WA' });
        }}
        onTideStationClick={(tideStation) => setStateHelper({ tideStation })}
        onStreamFlowStationClick={(streamFlowStation) =>
          setStateHelper({ streamFlowStation })
        }
      />
      <ConditionReport tideStation={state.tideStation} date={state.date} />
    </div>
  );
}

export default Explorer;

//PRIVATE

function getHtmlDate(date = new Date()) {
  return [
    date.getFullYear(),
    pad(1 + date.getMonth()),
    pad(date.getDate()),
  ].join('-');

  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
}

function getDate(htmlDate = getHtmlDate()) {
  const [YYYY, MM, DD] = htmlDate.split('-');
  return new Date(YYYY, MM - 1, DD);
}
