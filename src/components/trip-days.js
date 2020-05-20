import AbstractComponent from "./abstract-component.js";

const createDaysWrapTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <!-- Сортировка -->

      <!-- Контент -->
      <ul class="trip-days"></ul>
    </section>`
  );
};

export default class TripDays extends AbstractComponent {
  getTemplate() {
    return createDaysWrapTemplate();
  }
}
