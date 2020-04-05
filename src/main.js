import {createTripInfoWrapTemplate} from "./components/trip-info-wrap.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFiltersTemplate} from "./components/filters.js";
import {createSortTemplate} from "./components/sort.js";
import {createFormTemplate} from "./components/form.js";
import {createWaypointsWrapTemplate} from "./components/waypoints-wrap.js";
import {createWaypointTemplate} from "./components/waypoint.js";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripHeaderElement = document.querySelector(`.trip-main`);
render(tripHeaderElement, createTripInfoWrapTemplate(), `afterbegin`);

const tripInfoWrapElement = document.querySelector(`.trip-info`);
render(tripInfoWrapElement, createTripInfoTemplate());
render(tripInfoWrapElement, createTripCostTemplate());

const tripControlsElement = document.querySelector(`.trip-controls`);
const [menuTitleElement, filterTitleElement] = tripControlsElement.children;
render(menuTitleElement, createMenuTemplate(), `afterend`);
render(filterTitleElement, createFiltersTemplate(), `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createSortTemplate());
render(tripEventsElement, createFormTemplate());
render(tripEventsElement, createWaypointsWrapTemplate());

const WAYPOINTS_COUNT = 3;
const waypointsWrapElement = document.querySelector(`.trip-days`);
for (let i = 0; i < WAYPOINTS_COUNT; i++) {
  render(waypointsWrapElement, createWaypointTemplate());
}
