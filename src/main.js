import TripInfoWrapComponent from "./components/trip-info-wrap.js";
import TripInfoComponent from "./components/trip-info.js";
import CostComponent from "./components/trip-cost.js";
import MenuComponent from "./components/menu.js";
import FiltersComponent from "./components/filters.js";
import TripDaysComponent from "./components/trip-days.js";
import TripController from "./controllers/trip.js";
import {generateWaypoints} from "./mock/waypoint.js";
import {render, RenderPosition} from "./utils/render.js";

const tripHeaderElement = document.querySelector(`.trip-main`);
render(tripHeaderElement, new TripInfoWrapComponent(), RenderPosition.AFTERBEGIN);

const tripInfoWrapElement = document.querySelector(`.trip-info`);
render(tripInfoWrapElement, new TripInfoComponent(), RenderPosition.BEFOREEND);
render(tripInfoWrapElement, new CostComponent(), RenderPosition.BEFOREEND);

const tripControlsElement = document.querySelector(`.trip-controls`);
const [menuTitleElement, filterTitleElement] = tripControlsElement.children;
render(menuTitleElement, new MenuComponent(), RenderPosition.AFTEREND);
render(filterTitleElement, new FiltersComponent(), RenderPosition.AFTEREND);

const WAYPOINTS_COUNT = 15;
const waypoints = generateWaypoints(WAYPOINTS_COUNT);
const tripEventsElement = document.querySelector(`.trip-events`);

const tripDaysComponent = new TripDaysComponent();
const tripController = new TripController(tripDaysComponent);

render(tripEventsElement, tripDaysComponent, RenderPosition.BEFOREEND);
tripController.render(waypoints);
