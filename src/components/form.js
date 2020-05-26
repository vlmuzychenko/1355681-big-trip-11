import moment from "moment";
import flatpickr from "flatpickr";
import {TYPES, Mode} from "../const.js";
import {getCapitalizedString, getOffersByType} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";

import "flatpickr/dist/flatpickr.min.css";

const DefaultData = {
  saveButtonText: `Save`,
  deleteButtonText: `Delete`
};

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
        `<option value="${city.name}"></option>`
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
  if (!offersByType.length) {
    return ``;
  }

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
  if (!description.length) {
    return ``;
  }

  return (
    `<p class="event__destination-description">${description}</p>`
  );
};

const createPhotosWrapTemplate = (photos) => {
  if (!photos.length) {
    return ``;
  }

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${createPhotosTemplate(photos)}
      </div>
    </div>`
  );
};

const createPhotosTemplate = (photos) => {
  return photos
    .map((photo) => {
      return (
        `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
      );
    })
    .join(`\n`);
};


const createDestinationInfoTemplate = (info) => {
  if (!info.description && !info.photos) {
    return ``;
  }

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${createDescriptionTemplate(info.description)}

      ${createPhotosWrapTemplate(info.photos)}
    </section>`
  );
};

const createDetailsTemplate = (currentOffers, offersByType, info) => {
  if (!offersByType.length && !info.description && !info.photos) {
    return ``;
  }

  return (
    `<section class="event__details">
      ${createOffersWrapTemplate(offersByType, currentOffers)}

      ${createDestinationInfoTemplate(info)}
    </section>`
  );
};

const createControlElementsTemplate = (favoriteButtonCheck) => {
  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favoriteButtonCheck}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
  );
};

const createFormTemplate = (waypoint, options = {}, staticData) => {
  const {currentOffers, startTime, endTime, isFavorite} = waypoint;
  const {currentType, currentCity, info = {}, price, mode, externalData} = options;
  const transferTypes = createTypesTemplate(currentType, TYPES.TRANSFERS);
  const activityTypes = createTypesTemplate(currentType, TYPES.ACTIVITIES);
  const destination = `${currentType} ${TYPES.TRANSFERS.some((type) => currentType === type) ? `to` : `in`}`;
  const {destinations, offers} = staticData;
  const offersByType = getOffersByType(offers, currentType);
  const destinationsList = createDestinationsTemplate(destinations);
  const start = moment(startTime).format(`DD/MM/YY HH:mm`);
  const end = moment(endTime).format(`DD/MM/YY HH:mm`);
  const favoriteButtonCheck = isFavorite ? `checked` : ``;
  const details = createDetailsTemplate(currentOffers, offersByType, info);
  const isSaveButtonDisabled = destinations.find((item) => item.name === currentCity) && !isNaN(price) && price > 0 ? `` : `disabled`;
  const addingMode = mode === Mode.ADDING;
  const formClassName = addingMode ? `trip-events__item` : ``;
  const cancelButtonText = addingMode ? `Cancel` : `${externalData.deleteButtonText}`;
  const saveButtonText = externalData.saveButtonText;
  const controlElements = addingMode ? `` : createControlElementsTemplate(favoriteButtonCheck);

  return (
    `<form class="${formClassName} event  event--edit" action="#" method="post">
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

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaveButtonDisabled}>${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${cancelButtonText}</button>

        ${controlElements}
        
      </header>
      ${details}
    </form>`
  );
};

export default class Form extends AbstractSmartComponent {
  constructor(waypoint, staticData, mode) {
    super();
    this._waypoint = waypoint;
    this._staticData = staticData;
    this._destinations = this._staticData.destinations;
    this._mode = mode;
    this._submitHandler = null;
    this._deleteHandler = null;
    this._currentType = waypoint.currentType;
    this._currentCity = waypoint.currentCity;
    this._info = waypoint.info;
    this._price = waypoint.price;
    this._flatpickrStartTime = null;
    this._flatpickrEndTime = null;
    this._externalData = DefaultData;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFormTemplate(this._waypoint, {
      currentType: this._currentType,
      currentCity: this._currentCity,
      info: this._info,
      price: this._price,
      mode: this._mode,
      externalData: this._externalData,
    }, this._staticData);
  }

  removeElement() {
    if (this._flatpickrStartTime) {
      this._flatpickrStartTime.destroy();
      this._flatpickrStartTime = null;
    }

    if (this._flatpickrEndTime) {
      this._flatpickrEndTime.destroy();
      this._flatpickrEndTime = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setCancelButtonClickHandler(this._deleteHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const waypoint = this._waypoint;

    this._currentType = waypoint.currentType;
    this._currentCity = waypoint.currentCity;
    this._offersByType = waypoint.offersByType;
    this._info = waypoint.info;

    this.rerender();
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  disable() {
    const inputs = this.getElement().querySelectorAll(`input`);
    const buttons = this.getElement().querySelectorAll(`button`);

    [...inputs, ...buttons].forEach((item) => {
      item.disabled = true;
    });
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setCancelButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);

    this._deleteHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickrStartTime) {
      this._flatpickrStartTime.destroy();
      this._flatpickrStartTime = null;
    }

    if (this._flatpickrEndTime) {
      this._flatpickrEndTime.destroy();
      this._flatpickrEndTime = null;
    }

    const startTimeElement = this.getElement().querySelectorAll(`#event-start-time-1`);
    const endTimeElement = this.getElement().querySelectorAll(`#event-end-time-1`);

    this._flatpickrStartTime = this._initFlatpickr(startTimeElement, this._waypoint.startTime, null, (selectedDates, dateStr) => {
      if (new Date(dateStr).toISOString() > this._waypoint.endTime) {
        this._flatpickrEndTime = this._initFlatpickr(endTimeElement, dateStr, dateStr);
      }
    });

    this._flatpickrEndTime = this._initFlatpickr(endTimeElement, this._waypoint.endTime);
  }

  _initFlatpickr(element, defaultDate, minDate, onChange) {
    return flatpickr(element, {
      altInput: true,
      altFormat: `d/m/y H:i`,
      enableTime: true,
      allowInput: true,
      [`time_24hr`]: true,
      defaultDate,
      minDate,
      onChange
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const eventTypeList = element.querySelectorAll(`.event__type-input`);
    eventTypeList.forEach((item) => {
      item.addEventListener(`change`, (event) => {
        this._currentType = getCapitalizedString(event.target.value);
        this._offersByType = getOffersByType(this._staticData.offers, this._currentType);

        this.rerender();
      });
    });

    const eventInputDestination = element.querySelector(`.event__input--destination`);
    eventInputDestination.addEventListener(`change`, (event) => {
      if (this._currentCity === event.target.value) {
        return;
      }

      this._currentCity = event.target.value;

      this._info = this._currentCity ? this._destinations.find((city) => city.name === this._currentCity) : {};
      this.rerender();
    });

    const eventInputPrice = element.querySelector(`.event__input--price`);
    eventInputPrice.addEventListener(`change`, (event) => {
      if (this._price === event.target.value) {
        return;
      }

      this._price = event.target.value;
      this.rerender();
    });

    const eventInputStart = element.querySelector(`#event-start-time-1`);
    eventInputStart.addEventListener(`change`, (event) => {
      this._waypoint.startTime = new Date(event.target.value);
    });

    const eventInputEnd = element.querySelector(`#event-end-time-1`);
    eventInputEnd.addEventListener(`change`, (event) => {
      this._waypoint.endTime = new Date(event.target.value);
    });
  }
}
