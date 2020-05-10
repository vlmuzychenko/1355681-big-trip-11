import AbstractComponent from "./abstract-component.js";

const createAddEventButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class AddEvent extends AbstractComponent {
  getTemplate() {
    return createAddEventButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, (event) => {
      event.preventDefault();

      handler();
    });
  }

  disable() {
    this.getElement().disabled = true;
  }

  enable() {
    this.getElement().disabled = false;
  }
}
