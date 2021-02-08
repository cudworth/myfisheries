import Menu from './Menu/Menu.js';
import './TopMenu.css';
import menuIcon from './TopMenu.svg';

const myConfig = {
  id: 'TopMenu',
  classes: {
    menu: 'TopMenu',
    text: 'TopMenu-text',
    img: 'TopMenu-img',
    drawer: 'TopMenu-drawer',
    item: 'TopMenu-item',
  },
  text: 'Menu',
  img: { src: menuIcon, alt: 'Top menu icon', width: '42px', height: '42px' },
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

const TopMenu = function (props) {
  return <Menu config={myConfig} items={myItems} />;
};

export default TopMenu;
