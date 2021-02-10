import Menu from '../Menu/Menu.js';
import './MainMenu.css';
import menuIcon from './MainMenu.svg';

const myConfig = {
  id: 'MainMenu',
  classes: {
    menu: 'MainMenu',
    text: 'MainMenu-text',
    img: 'MainMenu-img',
    drawer: 'MainMenu-drawer',
    item: 'MainMenu-item',
  },
  text: 'Menu',
  img: { src: menuIcon, alt: 'Main menu icon', width: '42px', height: '42px' },
};

const myItems = [
  {
    text: 'Weather',
    onClick: () => {},
  },
  {
    text: 'Maps',
    onClick: () => {},
  },
  {
    text: 'Journal',
    onClick: () => {},
  },
  {
    text: 'Tide Projections',
    onClick: () => {},
  },
  {
    text: 'River Flows',
    onClick: () => {},
  },
];

const MainMenu = function (props) {
  return <Menu config={myConfig} items={myItems} />;
};

export default MainMenu;
