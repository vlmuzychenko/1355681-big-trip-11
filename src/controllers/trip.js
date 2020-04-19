import moment from "moment";
import SortComponent from "../components/sort.js";
import DayComponent from "../components/day.js";
import FormComponent from "../components/form.js";
import WaypointComponent from "../components/waypoint.js";
import NoWaypointsComponent from "../components/no-waypoints.js";
import {render, RenderPosition, replace} from "../utils/render.js";

const renderWaypoint = (dayListElement, waypoint) => {
  const replaceWaypointToEdit = () => {
    replace(waypointEditComponent, waypointComponent);
  };

  const replaceEditToWaypoint = () => {
    replace(waypointComponent, waypointEditComponent);
  };

  const onEscKeyDown = (event) => {
    const isEscKey = event.key === `Escape` || event.key === `Esc`;

    if (isEscKey) {
      replaceEditToWaypoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const waypointComponent = new WaypointComponent(waypoint);
  waypointComponent.setEditButtonClickHandler(() => {
    replaceWaypointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const waypointEditComponent = new FormComponent(waypoint);
  waypointEditComponent.setSubmitHandler((event) => {
    event.preventDefault();
    replaceEditToWaypoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(dayListElement, waypointComponent, RenderPosition.BEFOREEND);
};

const renderDay = (daysListElement, index, waypoints) => {
  const dayComponent = new DayComponent(index, waypoints);
  const waypointListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

  waypoints.forEach((waypoint) => {
    renderWaypoint(waypointListElement, waypoint);
  });

  render(daysListElement, dayComponent, RenderPosition.BEFOREEND);
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noWaypointsComponent = new NoWaypointsComponent();
    this._sortComponent = new SortComponent();
  }

  render(waypoints) {
    const containerComponent = this._container;
    const noWaypointsComponent = this._noWaypointsComponent;
    const containerElement = this._container.getElement();

    if (waypoints.length === 0) {
      replace(noWaypointsComponent, containerComponent);
      return;
    }

    render(containerElement, this._sortComponent, RenderPosition.BEFOREBEGIN);

    const dates = Object.values(waypoints).map((waypoint) => moment.utc(waypoint.startTime).format(`YYYY-MM-DD`));
    const unrepeatedDates = [...new Set(dates)].sort((a, b) => a - b);

    for (let i = 0; i < unrepeatedDates.length; i++) {
      const waypointsByDay = waypoints.filter((waypoint) => {
        return moment.utc(waypoint.startTime).format(`YYYY-MM-DD`) === unrepeatedDates[i];
      });

      renderDay(containerElement, i, waypointsByDay);
    }
  }
}
