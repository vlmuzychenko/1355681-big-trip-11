import {createElement} from "../utils.js";

const createDaysWrapTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

export default class tripDays {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createDaysWrapTemplate();
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
