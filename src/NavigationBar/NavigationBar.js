import './NavigationBar.css';
import TopMenu from '../TopMenu';
import AuthPanel from '../AuthPanel/AuthPanel';

const NavigationBar = function (props) {
  return (
    <div className="navigation-bar">
      <TopMenu />
      <div>My Fisheries App</div>
      <AuthPanel state={props.state} firebase={props.firebase} />
    </div>
  );
};

export default NavigationBar;
