import moment from "moment";
import TripInfoWrap from "./components/trip-info-wrap.js";
import TripInfo from "./components/trip-info.js";
import Cost from "./components/trip-cost.js";
import Menu from "./components/menu.js";
import Filters from "./components/filters.js";
import Sort from "./components/sort.js";
import TripDaysComponent from "./components/trip-days.js";
import Day from "./components/day.js";
import Form from "./components/form.js";
import Waypoint from "./components/waypoint.js";
import {generateWaypoints} from "./mock/waypoint.js";
import {render, RenderPosition} from "./utils.js";

const WAYPOINTS_COUNT = 15;

const tripHeaderElement = document.querySelector(`.trip-main`);
render(tripHeaderElement, new TripInfoWrap().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoWrapElement = document.querySelector(`.trip-info`);
render(tripInfoWrapElement, new TripInfo().getElement(), RenderPosition.BEFOREEND);
render(tripInfoWrapElement, new Cost().getElement(), RenderPosition.BEFOREEND);

const tripControlsElement = document.querySelector(`.trip-controls`);
const [menuTitleElement, filterTitleElement] = tripControlsElement.children;
render(menuTitleElement, new Menu().getElement(), RenderPosition.AFTEREND);
render(filterTitleElement, new Filters().getElement(), RenderPosition.AFTEREND);

const renderTripDays = (tripDaysComponent, waypoints) => {
  const daysListElement = tripDaysComponent.getElement();

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

    renderDay(daysListElement, i, waypointsByDay);
  }
};

const renderDay = (daysListElement, index, waypoints) => {
  const dayComponent = new Day(index, waypoints);
  const waypointListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

  waypoints.forEach((waypoint) => {
    renderWaypoint(waypointListElement, waypoint);
  });

  render(daysListElement, dayComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderWaypoint = (dayListElement, waypoint) => {
  const onEditButtonClick = () => {
    dayListElement.replaceChild(waypointEditComponent.getElement(), waypointComponent.getElement());
  };

  const onEditFormSubmit = (event) => {
    event.preventDefault();
    dayListElement.replaceChild(waypointComponent.getElement(), waypointEditComponent.getElement());
  };

  const waypointComponent = new Waypoint(waypoint);
  const editButton = waypointComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const waypointEditComponent = new Form(waypoint);
  const editForm = waypointEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(dayListElement, waypointComponent.getElement(), RenderPosition.BEFOREEND);
};

const waypoints = generateWaypoints(WAYPOINTS_COUNT);

const tripDaysComponent = new TripDaysComponent();
const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, new Sort().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, tripDaysComponent.getElement(), RenderPosition.BEFOREEND);
renderTripDays(tripDaysComponent, waypoints);
