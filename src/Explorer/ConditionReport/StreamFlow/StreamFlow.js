import './StreamFlow.css';
import { useEffect, useState } from 'react';
import { streamFlowModule } from './streamFlowModule';

const myStreamFlow = streamFlowModule();

function StreamFlow(props) {
  const { date, station } = props;
  const [state, setState] = useState({ data: null });

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
    myStreamFlow.getStreamFlow(station, date).then((data) => {
      setStateHelper({ data });
    });
  }, [date, station]);

  if (state.data) {
    const { siteName } = state.data;
    console.log(state.data);
    return (
      <div className="ConditionReport">
        <div>
          <h1>{`${siteName}`}</h1>
        </div>
        <div>Stream flow report here</div>
      </div>
    );
  } else {
    return <div className="ConditionReport">Loading Stream Flow Report</div>;
  }
}

export default StreamFlow;
