import './ConditionReport.css';
import Weather from './Weather/Weather';
import Tides from './Tides/Tides';
import StreamFlow from './StreamFlow/StreamFlow';

function ConditionReport(props) {
  const { date, tideStation, streamFlowStation } = props;

  function renderDate() {
    if (tideStation || streamFlowStation) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      return (
        <div>
          <h2>{date.toLocaleString('en-US', options)}</h2>
        </div>
      );
    }
  }

  function renderTides() {
    if (tideStation) {
      return <Tides date={date} station={tideStation} />;
    }
  }

  function renderStreamFlow() {
    if (streamFlowStation) {
      return <StreamFlow date={date} station={streamFlowStation} />;
    }
  }

  function renderWeather() {
    if (streamFlowStation) {
      return (
        <Weather
          date={date}
          lat={streamFlowStation.t}
          lng={streamFlowStation.n}
        />
      );
    }
    if (tideStation) {
      return <Weather date={date} lat={tideStation.t} lng={tideStation.n} />;
    }
  }

  return (
    <div>
      {renderDate()}
      {renderWeather()}
      {renderTides()}
      {renderStreamFlow()}
    </div>
  );
}

export default ConditionReport;
