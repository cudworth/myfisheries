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

  if (!state.user) {
    return (
      <div className="AuthPanel">
        <input value="Sign In" type="button" onClick={firebase.signIn} />;
      </div>
    );
  } else {
    return (
      <div className="AuthPanel">
        <div>{state.user.displayName}</div>
        <input value="Sign Out" type="button" onClick={firebase.signOut} />
      </div>
    );
  }
};

//        <input value="Sign Out" type="button" onClick={firebase.signOut} />

export default AuthPanel;
