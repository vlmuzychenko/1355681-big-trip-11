import AbstractComponent from "./abstract-component.js";

const createDaysWrapTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

export default class TripDays extends AbstractComponent {
  getTemplate() {
    return createDaysWrapTemplate();
  }
}
