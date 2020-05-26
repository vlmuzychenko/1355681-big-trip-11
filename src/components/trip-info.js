import moment from "moment";
import AbstractComponent from "./abstract-component.js";

const createTripInfoWrapTemplate = (waypointsModel) => {
  let totalPrice = 0;
  let destinationTitle = ``;
  let dates = ``;

  if (waypointsModel.getWaypoints().length) {
    totalPrice = waypointsModel.getTripPrice();

    let destinations = waypointsModel.getTripWay();
    if (destinations.length <= 3) {
      destinationTitle = destinations.map((destination, index) => {
        if (index) {
          return `&mdash; ${destination}`;
        } else {
          return destination;
        }
      })
      .join(` `);
    } else {
      destinationTitle = `${destinations[0]} &mdash;...&mdash; ${destinations[destinations.length - 1]}`;
    }

    let startDate = moment(waypointsModel.getTripStartDate()).format(`MMM DD`);
    let endDate = moment(waypointsModel.getTripEndDate()).format(`MMM DD`);
    dates = `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinationTitle}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
};

export default class TripInfoWrap extends AbstractComponent {
  constructor(waypointsModel) {
    super();

    this._waypointsModel = waypointsModel;
  }

  getTemplate() {
    return createTripInfoWrapTemplate(this._waypointsModel);
  }
}
