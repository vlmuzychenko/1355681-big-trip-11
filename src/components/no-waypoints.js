import AbstractComponent from "./abstract-component.js";

const createNoWaypointsTemplate = () => {
  return (
    `<p class="trip-events__msg">
      Click New Event to create your first point
    </p>`
  );
};

export default class NoWaypoints extends AbstractComponent {
  getTemplate() {
    return createNoWaypointsTemplate();
  }
}
