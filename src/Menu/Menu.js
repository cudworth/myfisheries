import './Menu.css';

const Menu = function (props) {
  const { config, items } = props;

  function toggleMenu() {
    const elem = document.getElementById(`${config.id}-drawer`);
    if (elem.classList.contains('hidden')) {
      elem.classList.remove('hidden');
    } else {
      elem.classList.add('hidden');
    }
  }

  function renderImg() {
    if (config.img) {
      return (
        <img
          src={config.img.src}
          alt={config.img.alt}
          className={`Menu-img ${config.classes.img}`}
        ></img>
      );
    }
  }

  function renderText() {
    if (config.text) {
      return (
        <div className={`Menu-text ${config.classes.text}`}>{config.text}</div>
      );
    }
  }

  function renderDrawer() {
    return (
      <div
        id={`${config.id}-drawer`}
        className={`hidden Menu-drawer ${config.classes.drawer}`}
      >
        {items.map((item, index) => {
          return (
            <div
              key={index}
              onClick={item.onClick}
              className={`Menu-item ${config.classes.item}`}
            >
              {item.text}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`Menu ${config.classes.menu}`}
      onMouseOver={() => toggleMenu()}
      onMouseOut={() => toggleMenu()}
    >
      {renderImg()}
      {renderText()}
      {renderDrawer()}
    </div>
  );
};

export default Menu;
