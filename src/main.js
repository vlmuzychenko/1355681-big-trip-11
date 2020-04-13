import moment from "moment";
import {createTripInfoWrapTemplate} from "./components/trip-info-wrap.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFiltersTemplate} from "./components/filters.js";
import {createSortTemplate} from "./components/sort.js";
import {createDaysWrapTemplate} from "./components/days-wrap.js";
import {createDayTemplate} from "./components/day.js";
import {generateWaypoints} from "./mock/waypoint.js";

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
render(tripEventsElement, createDaysWrapTemplate());

const daysWrapElement = document.querySelector(`.trip-days`);
const WAYPOINTS_COUNT = 15;
const waypoints = generateWaypoints(WAYPOINTS_COUNT);
const dates = [];
for (let data of waypoints) {
  dates.push(moment.utc(data.startTime).format(`YYYY-MM-DD`));
}
const unrepeatedDates = [...new Set(dates)];

unrepeatedDates.sort((a, b) => {
  return a - b;
});

for (let i = 0; i < unrepeatedDates.length; i++) {
  const waypointsByDay = waypoints.filter((waypoint) => {
    return moment.utc(waypoint.startTime).format(`YYYY-MM-DD`) === unrepeatedDates[i];
  });

  render(daysWrapElement, createDayTemplate(i, waypointsByDay));
}
