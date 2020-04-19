import AbstractComponent from "./abstract-component.js";

const createTripInfoWrapTemplate = () => {
  return (
    `<section class="trip-main__trip-info  trip-info">
    </section>`
  );
};

export default class TripInfoWrap extends AbstractComponent {
  getTemplate() {
    return createTripInfoWrapTemplate();
  }
}
