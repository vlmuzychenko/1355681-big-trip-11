import moment from "moment";
import {TYPES, CITIES, CITIES_INFO, OFFERS} from "../const.js";
import {getCapitalizedString} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";

const createTypesTemplate = (currentType, types) => {
  return types
    .map((type) => {
      return (
        `<div class="event__type-item">
          <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${currentType === type ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
        </div>`
      );
    })
    .join(`\n`);
};

const createDestinationsTemplate = (cities) => {
  return cities
    .map((city) => {
      return (
        `<option value="${city}"></option>`
      );
    })
    .join(`\n`);
};

const createOffersTemplate = (offersByType, currentOffers) => {
  return offersByType
    .map((offer) => {
      let isChecked = false;
      for (let item of currentOffers) {
        if (Object.values(item).includes(offer.name)) {
          isChecked = true;
          break;
        }
      }

      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.shortName}-1" type="checkbox" name="event-offer-${offer.shortName}" ${isChecked ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${offer.shortName}-1">
            <span class="event__offer-title">${offer.name}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const createOffersWrapTemplate = (offersByType, currentOffers) => {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOffersTemplate(offersByType, currentOffers)}
      </div>
    </section>`
  );
};

const createDescriptionTemplate = (description) => {
  return (
    `<p class="event__destination-description">${description}</p>`
  );
};

const createPhotosTemplate = (photos) => {
  return photos
    .map((photo) => {
      return (
        `<img class="event__photo" src="${photo}" alt="Event photo">`
      );
    })
    .join(`\n`);
};


const createDestinationInfoTemplate = (info) => {
  const description = info.description.length ? createDescriptionTemplate(info.description) : ``;
  const photos = info.photos.length ? createPhotosTemplate(info.photos) : ``;

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${description}

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos}
        </div>
      </div>
    </section>`
  );
};

const createDetailsTemplate = (currentOffers, offersByType, info) => {
  const offers = offersByType.length ? createOffersWrapTemplate(offersByType, currentOffers) : ``;
  const destinationInfo = info.description.length || info.photos.length ? createDestinationInfoTemplate(info) : ``;

  return (
    `<section class="event__details">
      ${offers}
      ${destinationInfo}
    </section>`
  );
};

const createFormTemplate = (waypoint, options = {}) => {
  const {currentOffers, startTime, endTime, price, isFavorite} = waypoint;
  const {currentType, currentCity, offersByType, info} = options;
  const transferTypes = createTypesTemplate(currentType, TYPES.transfer);
  const activityTypes = createTypesTemplate(currentType, TYPES.activity);
  const destination = `${currentType} ${TYPES.transfer.some((type) => currentType === type) ? `to` : `in`}`;
  const destinationsList = createDestinationsTemplate(CITIES);
  const start = moment.utc(new Date(startTime)).format(`DD/MM/YY HH:mm`);
  const end = moment.utc(new Date(endTime)).format(`DD/MM/YY HH:mm`);
  const favoriteButtonCheck = isFavorite ? `checked` : ``;
  const details = offersByType.length || info.description.length || info.photos.length ? createDetailsTemplate(currentOffers, offersByType, info) : ``;

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${transferTypes}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${activityTypes}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${destination}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentCity}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsList}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${start}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${end}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favoriteButtonCheck}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${details}
      </form>
    </li>`
  );
};

export default class Form extends AbstractSmartComponent {
  constructor(waypoint) {
    super();
    this._waypoint = waypoint;
    this._submitHandler = null;
    this._currentType = waypoint.currentType;
    this._currentCity = waypoint.currentCity;
    this._offersByType = waypoint.offersByType;
    this._info = waypoint.info;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFormTemplate(this._waypoint, {
      currentType: this._currentType,
      currentCity: this._currentCity,
      offersByType: this._offersByType,
      info: this._info,
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  reset() {
    const waypoint = this._waypoint;

    this._currentType = waypoint.currentType;
    this._currentCity = waypoint.currentCity;
    this._offersByType = waypoint.offersByType;
    this._info = waypoint.info;

    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, handler);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const eventTypeList = element.querySelectorAll(`.event__type-input`);
    eventTypeList.forEach((item) => {
      item.addEventListener(`change`, (event) => {
        this._currentType = getCapitalizedString(event.target.value);
        this._offersByType = OFFERS.filter((offer) => offer.type === this._currentType);

        this.rerender();
      });
    });

    const eventInputDestination = element.querySelector(`.event__input--destination`);
    eventInputDestination.addEventListener(`change`, (event) => {
      this._currentCity = event.target.value;
      this._info = CITIES_INFO.find((city) => city.name === this._currentCity);

      this.rerender();
    });
  }
}
