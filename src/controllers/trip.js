import moment from "moment";
import SortComponent, {SortType} from "../components/sort.js";
import DayComponent from "../components/day.js";
import FormComponent from "../components/form.js";
import WaypointComponent from "../components/waypoint.js";
import NoWaypointsComponent from "../components/no-waypoints.js";
import {render, RenderPosition, replace} from "../utils/render.js";

const getSortedWaypoints = (waypoints, sortType) => {
  let sortedWaypoints = [];
  const showingWaypoints = waypoints.slice();

  switch (sortType) {
    case SortType.DURATION_DOWN:
      sortedWaypoints = showingWaypoints.sort((a, b) => {
        const diffA = moment.utc(new Date(a.endTime)).diff(a.startTime);
        const diffB = moment.utc(new Date(b.endTime)).diff(b.startTime);
        return diffB - diffA;
      });
      break;
    case SortType.PRICE_DOWN:
      sortedWaypoints = showingWaypoints.sort((a, b) => b.price - a.price);
      break;
    case SortType.DEFAULT:
      sortedWaypoints = showingWaypoints;
      break;
  }

  return sortedWaypoints;
};

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

const renderWaypointsByDay = (container, waypoints) => {
  const dates = Object.values(waypoints).map((waypoint) => moment.utc(waypoint.startTime).format(`YYYY-MM-DD`));
  const unrepeatedDates = [...new Set(dates)].sort((a, b) => Date.parse(a) - Date.parse(b));

  for (let i = 0; i < unrepeatedDates.length; i++) {
    const waypointsByDay = waypoints.filter((waypoint) => {
      return moment.utc(waypoint.startTime).format(`YYYY-MM-DD`) === unrepeatedDates[i];
    });

    renderDay(container, i, waypointsByDay);
  }
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

    renderWaypointsByDay(containerElement, waypoints);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      containerElement.innerHTML = ``;

      const sortedWaypoints = getSortedWaypoints(waypoints, sortType);

      if (sortType === SortType.DEFAULT) {
        renderWaypointsByDay(containerElement, sortedWaypoints);
      } else {
        renderDay(containerElement, 0, sortedWaypoints);
      }
    });
  }
}
