import API from "./api.js";
import AddEventComponent from "./components/add-event.js";
import FilterController from "./controllers/filter.js";
import LoadingComponent from "./components/loading.js";
import MenuComponent, {MenuItem} from "./components/menu.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/trip.js";
import TripDaysComponent from "./components/trip-days.js";
import TripInfoComponent from "./components/trip-info.js";
import WaypointsModel from "./models/points.js";
import {render, remove} from "./utils/render.js";
import {RenderPosition} from "./const.js";

const AUTHORIZATION = `Basic KLDLdlakalskkladk3423=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip/`;

const api = new API(END_POINT, AUTHORIZATION);
const waypointsModel = new WaypointsModel();

const tripHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const tripInfoComponent = new TripInfoComponent(waypointsModel);
const addEventComponent = new AddEventComponent();
render(tripHeaderElement, addEventComponent, RenderPosition.BEFOREEND);

const menuTitleElement = tripControlsElement.children[0];
const filterController = new FilterController(tripControlsElement, waypointsModel);
filterController.render();

const menuComponent = new MenuComponent();
render(menuTitleElement, menuComponent, RenderPosition.AFTEREND);

const loadingComponent = new LoadingComponent();
const tripDaysComponent = new TripDaysComponent();
const tripController = new TripController(tripDaysComponent, waypointsModel, api, addEventComponent);

render(tripEventsElement, loadingComponent, RenderPosition.BEFOREEND);
render(tripEventsElement, tripDaysComponent, RenderPosition.BEFOREEND);

const statisticsComponent = new StatisticsComponent(waypointsModel);
render(tripEventsElement, statisticsComponent, RenderPosition.AFTEREND);
statisticsComponent.hide();

menuComponent.setClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.WAYPOINTS:
      menuComponent.setActiveItem(MenuItem.WAYPOINTS);
      tripController.show();
      statisticsComponent.hide();
      break;
    case MenuItem.STATISTICS:
      menuComponent.setActiveItem(MenuItem.STATISTICS);
      tripController.hide();
      statisticsComponent.show();
      break;
  }
});

addEventComponent.setClickHandler(() => {
  filterController.setDefaultFilterType();
  tripController.createWaypoint();
  addEventComponent.disable();
});

waypointsModel.setDataChangeHandler(() => {
  remove(tripInfoComponent);
  render(tripHeaderElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
});

api.getData()
  .then((data) => {
    const {destinations, offers, waypoints} = data;
    waypointsModel.setWaypoints(waypoints);
    waypointsModel.setDestinations(destinations);
    waypointsModel.setOffers(offers);
    remove(loadingComponent);
    render(tripHeaderElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
    tripController.render();
  });
