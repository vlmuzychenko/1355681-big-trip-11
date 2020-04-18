import moment from "moment";
import {createElement} from "../utils.js";

const createDayTemplate = (index, waypointsByDay) => {
  const date = moment.utc(new Date(waypointsByDay[0].startTime)).format(`YYYY-MM-DD`);
  const visibleDate = moment.utc(new Date(waypointsByDay[0].startTime)).format(`D MMM`);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${date}">${visibleDate}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class Day {
  constructor(index, waypoints) {
    this._waypoints = waypoints;
    this._index = index;

    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._index, this._waypoints);
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
