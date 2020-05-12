import {getWaypointsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

export default class Waypoint {
  constructor() {
    this._waypoints = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getWaypoints() {
    return getWaypointsByFilter(this._waypoints, this._activeFilterType);
  }

  setWaypoints(waypoints) {
    this._waypoints = Array.from(waypoints);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removeWaypoint(id) {
    const index = this._waypoints.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._waypoints = [].concat(this._waypoints.slice(0, index), this._waypoints.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateWaypoint(id, waypoint) {
    const index = this._waypoints.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._waypoints = [...this._waypoints.slice(0, index), waypoint, ...this._waypoints.slice(index + 1)];

    return true;
  }

  addWaypoint(waypoint) {
    this._waypoints = [].concat(waypoint, this._waypoints);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
