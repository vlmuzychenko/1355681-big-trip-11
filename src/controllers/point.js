import moment from "moment";
import FormComponent from "../components/form.js";
import WaypointComponent from "../components/waypoint.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {TYPES, OFFERS, Mode} from "../const.js";

export const EmptyWaypoint = {
  currentType: TYPES.transfer[0],
  currentCity: ``,
  offersByType: OFFERS.filter((item) => item.type === TYPES.transfer[0]),
  currentOffers: [],
  info: {
    description: ``,
    photos: ``
  },
  startTime: moment.utc(new Date()).format(),
  endTime: moment.utc(new Date()).format(),
  price: ``,
  isFavorite: false
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
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
    this._editComponent = new FormComponent(waypoint, this._mode);

    this._waypointComponent.setEditButtonClickHandler(() => {
      this._replaceWaypointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editComponent.setSubmitHandler((event) => {
      event.preventDefault();
      const data = this._editComponent.getData();

      this._onDataChange(this, waypoint, data);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editComponent.setCancelButtonClickHandler(() => this._onDataChange(this, waypoint, null));

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
