import moment from "moment";
import {TYPES} from "../const.js";
import {createElement} from "../utils.js";

const createOffersTemplate = (offers) => {
  return offers
    .map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    })
    .join(`\n`);
};

const createWaypointTemplate = (waypoint) => {
  const {currentType, city, currentOffers, startTime, endTime, diffTime, price} = waypoint;
  const eventOffers = currentOffers.length ? createOffersTemplate(currentOffers) : ``;
  const eventTitle = `${currentType} ${TYPES.transfer.some((type) => currentType === type) ? `to` : `in`} ${city}`;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${currentType.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTitle}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTime}">${moment.utc(new Date(startTime)).format(`HH:mm`)}</time>
            &mdash;
            <time class="event__end-time" datetime="${endTime}">${moment.utc(new Date(endTime)).format(`HH:mm`)}</time>
          </p>
          <p class="event__duration">${diffTime}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${eventOffers}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Waypoint {
  constructor(waypoint) {
    this._waypoint = waypoint;

    this._element = null;
  }

  getTemplate() {
    return createWaypointTemplate(this._waypoint);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
