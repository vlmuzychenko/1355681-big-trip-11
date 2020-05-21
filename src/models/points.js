import {getWaypointsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

export default class Waypoints {
  constructor() {
    this._waypoints = [];
    this._destinations = [];
    this._offers = [];

    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getWaypoints() {
    return getWaypointsByFilter(this._waypoints, this._activeFilterType);
  }

  getWaypointsAll() {
    return this._waypoints;
  }

  setWaypoints(waypoints) {
    this._waypoints = Array.from(waypoints);
    this._callHandlers(this._dataChangeHandlers);
  }

  getDestinations() {
    return this._destinations;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getOffers() {
    return this._offers;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  addWaypoint(waypoint) {
    this._waypoints = [].concat(waypoint, this._waypoints);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateWaypoint(id, waypoint) {
    const index = this._waypoints.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._waypoints = [...this._waypoints.slice(0, index), waypoint, ...this._waypoints.slice(index + 1)];

    return true;
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

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
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
