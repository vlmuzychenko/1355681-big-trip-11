import moment from "moment";
import SortComponent, {SortType} from "../components/sort.js";
import DayComponent from "../components/day.js";
import NoWaypointsComponent from "../components/no-waypoints.js";
import WaypointController from "./point.js";
import {render, replace, RenderPosition} from "../utils/render.js";

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

const renderWaypointsByDay = (container, waypoints, onDataChange, onViewChange) => {
  const dates = Object.values(waypoints).map((waypoint) => moment.utc(waypoint.startTime).format(`YYYY-MM-DD`));
  const unrepeatedDates = [...new Set(dates)].sort((a, b) => Date.parse(a) - Date.parse(b));
  let newWaypoints = [];

  for (let i = 0; i < unrepeatedDates.length; i++) {
    const waypointsByDay = waypoints.filter((waypoint) => {
      return moment.utc(waypoint.startTime).format(`YYYY-MM-DD`) === unrepeatedDates[i];
    });

    const newWaypoint = renderDay(container, i, waypointsByDay, onDataChange, onViewChange);
    newWaypoints = newWaypoints.concat(newWaypoint);
  }

  return newWaypoints;
};

const renderDay = (daysListElement, index, waypoints, onDataChange, onViewChange) => {
  const dayComponent = new DayComponent(index, waypoints);
  const waypointListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

  const waypointControllers = waypoints.map((waypoint) => {
    const waypointController = new WaypointController(waypointListElement, onDataChange, onViewChange);
    waypointController.render(waypoint);

    return waypointController;
  });

  render(daysListElement, dayComponent, RenderPosition.BEFOREEND);

  return waypointControllers;
};

export default class TripController {
  constructor(container) {
    this._waypoints = [];
    this._waypointControllers = [];

    this._container = container;

    this._noWaypointsComponent = new NoWaypointsComponent();
    this._sortComponent = new SortComponent();

    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(waypoints) {
    this._waypoints = waypoints;
    const containerComponent = this._container;
    const noWaypointsComponent = this._noWaypointsComponent;
    const containerElement = this._container.getElement();

    if (this._waypoints.length === 0) {
      replace(noWaypointsComponent, containerComponent);
      return;
    }

    render(containerElement, this._sortComponent, RenderPosition.BEFOREBEGIN);

    const newWaypoints = renderWaypointsByDay(containerElement, this._waypoints, this._onDataChange, this._onViewChange);
    this._waypointControllers = this._waypointControllers.concat(newWaypoints);
  }

  _onViewChange() {
    this._waypointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortedWaypoints = getSortedWaypoints(this._waypoints, sortType);
    const containerElement = this._container.getElement();
    let newWaypoints = [];
    containerElement.innerHTML = ``;

    if (sortType === SortType.DEFAULT) {
      newWaypoints = renderWaypointsByDay(containerElement, sortedWaypoints, this._onDataChange, this._onViewChange);
    } else {
      newWaypoints = renderDay(containerElement, 0, sortedWaypoints, this._onDataChange, this._onViewChange);
    }

    this._waypointControllers = this._waypointControllers.concat(newWaypoints);
  }

  _onDataChange(waypointController, oldData, newData) {
    const index = this._waypoints.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._waypoints = [...this._waypoints.slice(0, index), newData, ...this._waypoints.slice(index + 1)];

    waypointController.render(this._waypoints[index]);
  }
}
