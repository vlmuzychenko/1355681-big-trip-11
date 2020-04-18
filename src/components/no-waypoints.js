import {createElement} from "../utils.js";

const createNoWaypointsTemplate = () => {
  return (
    `<p class="trip-events__msg">
      Click New Event to create your first point
    </p>`
  );
};

export default class NoWaypoints {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoWaypointsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
