import moment from "moment";
import SortComponent from "../components/sort.js";
import DayComponent from "../components/day.js";
import NoWaypointsComponent from "../components/no-waypoints.js";
import WaypointController, {EmptyWaypoint} from "./point.js";
import {SortType, Mode as WaypointControllerMode} from "../const.js";
import {render, RenderPosition, remove} from "../utils/render.js";

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

  const waypointControllers = waypoints.map((waypoint) => {
    const waypointWrapper = dayComponent.createWaypointWrapperElement();

    const waypointController = new WaypointController(waypointWrapper, onDataChange, onViewChange);
    waypointController.render(waypoint, WaypointControllerMode.DEFAULT);

    return waypointController;
  });

  render(daysListElement, dayComponent, RenderPosition.BEFOREEND);

  return waypointControllers;
};

export default class TripController {
  constructor(container, waypointsModel, addEventComponent) {
    this._waypoints = [];
    this._waypointsControllers = [];

    this._container = container;
    this._waypointsModel = waypointsModel;
    this._addEventComponent = addEventComponent;

    this._sortComponent = new SortComponent();
    this._creatingWaypoint = null;
    this._noWaypointsComponent = null;

    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._waypointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const containerElement = this._container.getElement();
    const waypoints = this._waypointsModel.getWaypoints();

    if (waypoints.length === 0) {
      this._noWaypointsComponent = new NoWaypointsComponent();
      render(containerElement.parentElement, this._noWaypointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(containerElement, this._sortComponent, RenderPosition.BEFOREBEGIN);

    this._renderWaypointsByDay(waypoints);
  }

  createWaypoint() {
    if (this._noWaypointsComponent) {
      remove(this._noWaypointsComponent);
    }

    const containerElement = this._container.getElement();

    this._creatingWaypoint = new WaypointController(containerElement, this._onDataChange, this._onViewChange);
    this._creatingWaypoint.render(EmptyWaypoint, WaypointControllerMode.ADDING);

    this._waypointsControllers = this._waypointsControllers.concat(this._creatingWaypoint);
  }

  _removeWaypoints() {
    this._container.getElement().innerHTML = ``;
    this._waypointsControllers.forEach((waypointController) => waypointController.destroy());
    this._waypointsControllers = [];
  }

  _renderWaypointsByDay(waypoints) {
    const containerElement = this._container.getElement();

    const newWaypoints = renderWaypointsByDay(containerElement, waypoints, this._onDataChange, this._onViewChange);
    this._waypointsControllers = this._waypointsControllers.concat(newWaypoints);
  }

  _updateWaypoints() {
    this._removeWaypoints();
    this._renderWaypointsByDay(this._waypointsModel.getWaypoints());
  }

  _onViewChange() {
    if (this._creatingWaypoint) {
      this._creatingWaypoint = null;
      this._addEventComponent.enable();
    }

    this._waypointsControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortedWaypoints = getSortedWaypoints(this._waypointsModel.getWaypoints(), sortType);

    const containerElement = this._container.getElement();
    let newWaypoints = [];
    this._removeWaypoints();

    if (sortType === SortType.DEFAULT) {
      this._renderWaypointsByDay(sortedWaypoints);
    } else {
      newWaypoints = renderDay(containerElement, false, sortedWaypoints, this._onDataChange, this._onViewChange);
    }

    this._waypointsControllers = this._waypointsControllers.concat(newWaypoints);
    this._addEventComponent.enable();
  }

  _onDataChange(waypointController, oldData, newData) {
    if (oldData === EmptyWaypoint) {
      this._creatingWaypoint = null;
      waypointController.destroy();
      this._addEventComponent.enable();
      if (newData === null) {
        this._updateWaypoints();
      } else {
        if (!this._waypointsModel.getWaypoints().length) {
          render(this._container.getElement(), this._sortComponent, RenderPosition.BEFOREBEGIN);
        }

        this._waypointsModel.addWaypoint(newData);
        this._updateWaypoints();
      }
    } else if (newData === null) {
      this._waypointsModel.removeWaypoint(oldData.id);
      this._updateWaypoints();

      if (!this._waypointsModel.getWaypoints().length) {
        remove(this._sortComponent);
        render(this._container.getElement().parentElement, this._noWaypointsComponent, RenderPosition.BEFOREEND);
      }
    } else {
      const isSuccess = this._waypointsModel.updateWaypoint(oldData.id, newData);

      if (isSuccess) {
        waypointController.render(newData, WaypointControllerMode.DEFAULT);
      }
    }
  }

  _onFilterChange() {
    this._sortComponent.setDefaultSortType();
    this._updateWaypoints();
    this._addEventComponent.enable();
  }
}
