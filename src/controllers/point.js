import moment from "moment";
import FormComponent from "../components/form.js";
import Offer from "../models/offer.js";
import WaypointComponent from "../components/waypoint.js";
import WapointModel from "../models/point.js";
import {getCapitalizedString, getOffersByType} from "../utils/common.js";
import {render, replace, remove} from "../utils/render.js";
import {TYPES, Mode, RenderPosition} from "../const.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export const EmptyWaypoint = {
  currentType: TYPES.TRANSFERS[0],
  currentCity: ``,
  currentOffers: [],
  info: {
    description: ``,
    photos: ``
  },
  startTime: moment(new Date()).format(),
  endTime: moment(new Date()).format(),
  price: ``,
  isFavorite: false
};

const parseFormData = (formData, staticData) => {
  const {destinations, offers} = staticData;
  const currentType = getCapitalizedString(formData.get(`event-type`));
  const offersByType = getOffersByType(offers, currentType);
  const currentOffers = [];
  offersByType.forEach((offer) => {
    if (formData.has(`event-offer-${offer.shortName}`)) {
      currentOffers.push(Offer.toRAW(offer));
    }
  });

  const currentCity = formData.get(`event-destination`);
  const currentCityInfo = destinations.filter((city) => city.name === currentCity);
  const description = currentCityInfo[0].description;
  const photos = currentCityInfo[0].photos;
  const isFavorite = !!formData.get(`event-favorite`);

  return new WapointModel({
    "type": currentType,
    "date_from": new Date(formData.get(`event-start-time`)),
    "date_to": new Date(formData.get(`event-end-time`)),
    "destination": {
      "name": currentCity,
      "description": description,
      "pictures": photos
    },
    "base_price": formData.get(`event-price`),
    "is_favorite": isFavorite,
    "offers": currentOffers
  });
};

export default class PointController {
  constructor(container, staticData, onDataChange, onViewChange) {
    this._container = container;
    this._staticData = staticData;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._waypointComponent = null;
    this._editComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(waypoint, mode) {
    const oldWaypointComponent = this._waypointComponent;
    const oldEditComponent = this._editComponent;

    this._mode = mode;

    this._waypointComponent = new WaypointComponent(waypoint);
    this._editComponent = new FormComponent(waypoint, this._staticData, this._mode);

    this._waypointComponent.setEditButtonClickHandler(() => {
      this._replaceWaypointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editComponent.setSubmitHandler((event) => {
      event.preventDefault();
      const formData = this._editComponent.getData();
      const data = parseFormData(formData, this._staticData);

      this._editComponent.setData({saveButtonText: `Saving...`});
      this._editComponent.disable();

      this._onDataChange(this, waypoint, data);
    });

    this._editComponent.setCancelButtonClickHandler(() => {
      this._editComponent.setData({deleteButtonText: `Deleting...`});
      this._editComponent.disable();

      this._onDataChange(this, waypoint, null);
    });

    switch (this._mode) {
      case Mode.DEFAULT:
        if (oldWaypointComponent && oldEditComponent) {
          replace(this._waypointComponent, oldWaypointComponent);
          replace(this._editComponent, oldEditComponent);
          this._replaceEditToWaypoint();
        } else {
          render(this._container, this._waypointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldWaypointComponent && oldEditComponent) {
          remove(oldWaypointComponent);
          remove(oldEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._editComponent, RenderPosition.BEFOREBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode === Mode.EDIT) {
      this._replaceEditToWaypoint();
    } else if (this._mode === Mode.ADDING) {
      this.destroy();
    }
  }

  destroy() {
    remove(this._editComponent);
    remove(this._waypointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._editComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._editComponent.getElement().style.animation = ``;

      this._editComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`
      });

      this.highlight();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  highlight() {
    this._editComponent.getElement().classList.add(`highlight`);
  }

  removeHighlight() {
    this._editComponent.getElement().classList.remove(`highlight`);
  }

  _replaceWaypointToEdit() {
    this._onViewChange();
    replace(this._editComponent, this._waypointComponent);

    this._mode = Mode.EDIT;
  }

  _replaceEditToWaypoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._editComponent.reset();

    if (document.contains(this._editComponent.getElement())) {
      replace(this._waypointComponent, this._editComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(event) {
    const isEscKey = event.key === `Escape` || event.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyWaypoint, null);
      }
      this._replaceEditToWaypoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
