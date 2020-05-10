import TripInfoWrapComponent from "./components/trip-info-wrap.js";
import TripInfoComponent from "./components/trip-info.js";
import CostComponent from "./components/trip-cost.js";
import MenuComponent, {MenuItem} from "./components/menu.js";
import AddEventComponent from "./components/add-event.js";
import FilterController from "./controllers/filter.js";
import TripDaysComponent from "./components/trip-days.js";
import TripController from "./controllers/trip.js";
import WaypointModel from "./models/point.js";
import {generateWaypoints} from "./mock/waypoint.js";
import {render, RenderPosition} from "./utils/render.js";

const tripHeaderElement = document.querySelector(`.trip-main`);
const addEventComponent = new AddEventComponent();
render(tripHeaderElement, new TripInfoWrapComponent(), RenderPosition.AFTERBEGIN);
render(tripHeaderElement, addEventComponent, RenderPosition.BEFOREEND);

const tripInfoWrapElement = document.querySelector(`.trip-info`);
render(tripInfoWrapElement, new TripInfoComponent(), RenderPosition.BEFOREEND);
render(tripInfoWrapElement, new CostComponent(), RenderPosition.BEFOREEND);

const WAYPOINTS_COUNT = 15;
const waypoints = generateWaypoints(WAYPOINTS_COUNT);
const waypointModel = new WaypointModel();
waypointModel.setWaypoints(waypoints);

const tripControlsElement = document.querySelector(`.trip-controls`);
const menuTitleElement = tripControlsElement.children[0];
const filterController = new FilterController(tripControlsElement, waypointModel);
filterController.render();

const menuComponent = new MenuComponent();
render(menuTitleElement, menuComponent, RenderPosition.AFTEREND);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripDaysComponent = new TripDaysComponent();
const tripController = new TripController(tripDaysComponent, waypointModel, addEventComponent);

render(tripEventsElement, tripDaysComponent, RenderPosition.BEFOREEND);
tripController.render();

menuComponent.setClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      menuComponent.setActiveItem(MenuItem.STATISTICS);
      break;
    case MenuItem.TASKS:
      menuComponent.setActiveItem(MenuItem.TASKS);
      break;
  }
});

addEventComponent.setClickHandler(() => {
  filterController.setDefaultFilterType();
  tripController.createWaypoint();
  addEventComponent.disable();
});
