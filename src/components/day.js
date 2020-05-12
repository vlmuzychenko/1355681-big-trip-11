import moment from "moment";
import {createElement} from "../utils/render.js";
import AbstractComponent from "./abstract-component.js";

const createWaypointWrapperTemplate = () => {
  return (
    `<li class="trip-events__item"></li>`
  );
};

const createDayInfoTemplate = (index, waypointsByDay) => {
  if (index === false) {
    return ``;
  } else {
    const date = moment.utc(new Date(waypointsByDay[0].startTime)).format(`YYYY-MM-DD`);
    const visibleDate = moment.utc(new Date(waypointsByDay[0].startTime)).format(`D MMM`);

    return (
      `<span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${date}">${visibleDate}</time>`
    );
  }
};

const createDayTemplate = (index, waypointsByDay) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${createDayInfoTemplate(index, waypointsByDay)}
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(index, waypoints) {
    super();
    this._waypoints = waypoints;
    this._index = index;
  }

  getTemplate() {
    return createDayTemplate(this._index, this._waypoints);
  }

  _getWaypointWrapperTemplate() {
    return createWaypointWrapperTemplate();
  }

  _renderWaypointWrapper(element) {
    this.getElement().querySelector(`.trip-events__list`).append(element);
  }

  createWaypointWrapperElement() {
    const waypointWrapper = createElement(this._getWaypointWrapperTemplate());
    this._renderWaypointWrapper(waypointWrapper);

    return waypointWrapper;
  }
}
