import {getWaypointsByFilter} from "../utils/filter.js";
import {getSortedWaypoints} from "../utils/common.js";
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

  getTripPrice() {
    const prices = this._waypoints.map((waypoint) => waypoint.price);
    const offers = [];

    this._waypoints.forEach((waypoint) => {
      offers.push(...waypoint.currentOffers);
    });

    const offerPrices = offers.map((offer) => offer.price);

    return [...prices, ...offerPrices]
      .reduce((accumulator, price) => accumulator + price);
  }

  getTripWay() {
    const sortedWaypoints = getSortedWaypoints(this._waypoints);

    return sortedWaypoints.map((waypoint) => waypoint.currentCity);
  }

  getTripStartDate() {
    const sortedWaypoints = getSortedWaypoints(this._waypoints);

    return sortedWaypoints[0].startTime;
  }

  getTripEndDate() {
    const sortedWaypoints = getSortedWaypoints(this._waypoints);

    return sortedWaypoints[sortedWaypoints.length - 1].endTime;
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
    this._callHandlers(this._dataChangeHandlers);

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
