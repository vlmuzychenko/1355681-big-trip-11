import AbstractComponent from "./abstract-component.js";

export const MenuItem = {
  WAYPOINTS: `trip-tabs__btn--table`,
  STATISTICS: `trip-tabs__btn--stats`,
};

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" id="trip-tabs__btn--table" href="#">Table</a>
      <a class="trip-tabs__btn" id="trip-tabs__btn--stats" href="#">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);
    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    items.forEach((it) => it.classList.remove(`trip-tabs__btn--active`));

    if (item) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, (event) => {
      if (event.target.tagName !== `A`) {
        return;
      }
      event.preventDefault();
      const menuItem = event.target.id;

      handler(menuItem);
    });
  }
}
