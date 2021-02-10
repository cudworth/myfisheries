import './NavigationBar.css';
import MainMenu from '../MainMenu/MainMenu';
import AuthPanel from '../AuthPanel/AuthPanel';

const NavigationBar = function (props) {
  return (
    <div className="navigation-bar">
      <MainMenu />
      <div>My Fisheries App</div>
      <AuthPanel state={props.state} firebase={props.firebase} />
    </div>
  );
};

export default NavigationBar;
