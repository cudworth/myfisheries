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
  text: 'Top Menu',
  img: { src: menuIcon, alt: 'Top menu icon', width: '42px', height: '42px' },
};

const myItems = [
  {
    text: 'Weather',
    onClick: () => {
      console.log(this.text);
    },
  },
  {
    text: 'Maps',
    onClick: () => {
      console.log(this.text);
    },
  },
  {
    text: 'Journal',
    onClick: () => {
      console.log(this.text);
    },
  },
  {
    text: 'Tide Projections',
    onClick: () => {
      console.log(this.text);
    },
  },
  {
    text: 'River Flows',
    onClick: () => {
      console.log(this.text);
    },
  },
];

const TopMenu = function (props) {
  return <Menu config={myConfig} items={myItems} />;
};

export default TopMenu;
