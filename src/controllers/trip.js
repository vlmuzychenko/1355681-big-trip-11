import moment from "moment";
import DayComponent from "../components/day.js";
import NoWaypointsComponent from "../components/no-waypoints.js";
import SortComponent from "../components/sort.js";
import WaypointController, {EmptyWaypoint} from "./point.js";
import {SortType, RenderPosition, Mode as WaypointControllerMode} from "../const.js";
import {render, remove} from "../utils/render.js";

const getSortedWaypoints = (waypoints, sortType) => {
  let sortedWaypoints = [];
  const showingWaypoints = waypoints.slice();

  switch (sortType) {
    case SortType.DURATION_DOWN:
      sortedWaypoints = showingWaypoints.sort((a, b) => {
        const diffA = moment(a.endTime).diff(a.startTime);
        const diffB = moment(b.endTime).diff(b.startTime);
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

const renderWaypointsByDay = (container, waypoints, data, onDataChange, onViewChange) => {
  const {destinations, offers} = data;
  const dates = Object.values(waypoints).map((waypoint) => moment(waypoint.startTime).format(`YYYY-MM-DD`));
  const unrepeatedDates = [...new Set(dates)].sort((a, b) => Date.parse(a) - Date.parse(b));
  let newWaypoints = [];

  for (let i = 0; i < unrepeatedDates.length; i++) {
    const waypointsByDay = waypoints.filter((waypoint) => {
      return moment(waypoint.startTime).format(`YYYY-MM-DD`) === unrepeatedDates[i];
    });

    waypointsByDay.sort((a, b) => {
      return moment(a.startTime) - moment(b.startTime);
    });

    const newWaypoint = renderDay(container, i, waypointsByDay, {destinations, offers}, onDataChange, onViewChange);
    newWaypoints = newWaypoints.concat(newWaypoint);
  }

  return newWaypoints;
};

const renderDay = (daysListElement, index, waypointsByDay, data, onDataChange, onViewChange) => {
  const {destinations, offers} = data;

  const dayComponent = new DayComponent(index, waypointsByDay);

  const waypointControllers = waypointsByDay.map((waypoint) => {
    const waypointWrapper = dayComponent.createWaypointWrapperElement();

    const waypointController = new WaypointController(waypointWrapper, {destinations, offers}, onDataChange, onViewChange);
    waypointController.render(waypoint, WaypointControllerMode.DEFAULT);

    return waypointController;
  });

  render(daysListElement, dayComponent, RenderPosition.BEFOREEND);

  return waypointControllers;
};

export default class TripController {
  constructor(container, waypointsModel, api, addEventComponent) {
    this._waypoints = [];
    this._waypointsControllers = [];

    this._container = container;
    this._waypointsModel = waypointsModel;
    this._addEventComponent = addEventComponent;
    this._api = api;

    this._noWaypointsComponent = new NoWaypointsComponent();
    this._sortComponent = new SortComponent();
    this._creatingWaypoint = null;
    this._currentSortType = this._sortComponent.getSortType();

    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._waypointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  show() {
    this._container.showParent();
  }

  hide() {
    this._container.hideParent();
    this._currentSortType = SortType.DEFAULT;
    this._sortComponent.setDefaultSortType();
    this._updateWaypoints();
    this._addEventComponent.enable();
  }

  render() {
    const containerElement = this._container.getElement();
    const waypoints = this._waypointsModel.getWaypoints();

    if (waypoints.length === 0) {
      render(containerElement.parentElement, this._noWaypointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(containerElement, this._sortComponent, RenderPosition.BEFOREBEGIN);

    this._renderWaypoints(waypoints);
  }

  createWaypoint() {
    if (this._noWaypointsComponent) {
      remove(this._noWaypointsComponent);
    }

    const containerElement = this._container.getElement();
    const destinations = this._waypointsModel.getDestinations();
    const offers = this._waypointsModel.getOffers();

    this._creatingWaypoint = new WaypointController(containerElement, {destinations, offers}, this._onDataChange, this._onViewChange);
    this._creatingWaypoint.render(EmptyWaypoint, WaypointControllerMode.ADDING);

    this._waypointsControllers = this._waypointsControllers.concat(this._creatingWaypoint);
  }

  _removeWaypoints() {
    this._container.getElement().innerHTML = ``;
    this._waypointsControllers.forEach((waypointController) => waypointController.destroy());
    this._waypointsControllers = [];
  }

  _renderWaypoints(waypoints) {
    const containerElement = this._container.getElement();
    const destinations = this._waypointsModel.getDestinations();
    const offers = this._waypointsModel.getOffers();
    let newWaypoints = [];

    if (this._currentSortType === SortType.DEFAULT) {
      newWaypoints = renderWaypointsByDay(containerElement, waypoints, {destinations, offers}, this._onDataChange, this._onViewChange);
    } else {
      newWaypoints = renderDay(containerElement, null, waypoints, {destinations, offers}, this._onDataChange, this._onViewChange);
    }

    this._waypointsControllers = this._waypointsControllers.concat(newWaypoints);
  }

  _updateWaypoints() {
    const sortedWaypoints = getSortedWaypoints(this._waypointsModel.getWaypoints(), this._currentSortType);

    this._removeWaypoints();
    this._renderWaypoints(sortedWaypoints);
  }

  _onViewChange() {
    if (this._creatingWaypoint) {
      this._creatingWaypoint = null;
      this._addEventComponent.enable();
    }

    this._waypointsControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._updateWaypoints();
    this._addEventComponent.enable();
  }

  _onDataChange(waypointController, oldData, newData) {
    if (oldData === EmptyWaypoint) {
      this._creatingWaypoint = null;

      if (newData === null) {
        waypointController.destroy();
        this._addEventComponent.enable();
        this._updateWaypoints();
        if (!this._waypointsModel.getWaypoints().length) {
          render(this._container.getElement().parentElement, this._noWaypointsComponent, RenderPosition.BEFOREEND);
        }
      } else {
        waypointController.removeHighlight();

        this._api.createWaypoint(newData)
          .then((waypointModel) => {
            if (!this._waypointsModel.getWaypoints().length) {
              render(this._container.getElement(), this._sortComponent, RenderPosition.BEFOREBEGIN);
            }
            waypointController.destroy();
            this._addEventComponent.enable();
            this._waypointsModel.addWaypoint(waypointModel);
            this._updateWaypoints();
          })
          .catch(() => {
            waypointController.shake();
          });
      }
    } else if (newData === null) {
      waypointController.removeHighlight();

      this._api.deleteWaypoint(oldData.id)
        .then(() => {
          this._waypointsModel.removeWaypoint(oldData.id);
          this._updateWaypoints();

          if (!this._waypointsModel.getWaypoints().length) {
            remove(this._sortComponent);
            render(this._container.getElement().parentElement, this._noWaypointsComponent, RenderPosition.BEFOREEND);
          }
        })
        .catch(() => {
          waypointController.shake();
        });
    } else {
      waypointController.removeHighlight();

      this._api.updateWaypoint(oldData.id, newData)
        .then((waypointModel) => {
          const isSuccess = this._waypointsModel.updateWaypoint(oldData.id, waypointModel);

          if (isSuccess) {
            waypointController.render(waypointModel, WaypointControllerMode.DEFAULT);
            this._updateWaypoints();
          }
        })
        .catch(() => {
          waypointController.shake();
        });
    }
  }

  _onFilterChange() {
    this._sortComponent.setDefaultSortType();
    this._currentSortType = this._sortComponent.getSortType();
    this._updateWaypoints();
    this._addEventComponent.enable();
  }
}
