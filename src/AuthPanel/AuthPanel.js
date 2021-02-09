import { useEffect } from 'react';
import './AuthPanel.css';

const AuthPanel = function (props) {
  const [state, setState] = props.state;
  const firebase = props.firebase;

  useEffect(() => {
    firebase.initFirebaseAuth((user) => {
      setState((prev) => {
        const next = { ...prev };
        next.user = user ? user : null;
        return next;
      });
    });
  }, [firebase, setState]);

  const renderPanel = function () {
    if (!state.user) {
      return (
        <div>
          <input value="Sign In" type="button" onClick={firebase.signIn} />;
        </div>
      );
    } else {
      return (
        <div>
          <div>{state.user.displayName}</div>
          <input value="Sign Out" type="button" onClick={firebase.signOut} />
        </div>
      );
    }
  };

  return <div className="AuthPanel">{renderPanel()}</div>;
};

export default AuthPanel;
