import FormComponent from "../components/form.js";
import WaypointComponent from "../components/waypoint.js";
import {render, replace, RenderPosition} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
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

  render(waypoint) {
    const oldWaypointComponent = this._waypointComponent;
    const oldEditComponent = this._editComponent;

    this._waypointComponent = new WaypointComponent(waypoint);
    this._editComponent = new FormComponent(waypoint);

    this._waypointComponent.setEditButtonClickHandler(() => {
      this._replaceWaypointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editComponent.setSubmitHandler((event) => {
      event.preventDefault();
      this._replaceEditToWaypoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, waypoint, Object.assign({}, waypoint, {
        isFavorite: !waypoint.isFavorite,
      }));
    });

    if (oldWaypointComponent && oldEditComponent) {
      replace(this._waypointComponent, oldWaypointComponent);
      replace(this._editComponent, oldEditComponent);
    } else {
      render(this._container, this._waypointComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {

      this._replaceEditToWaypoint();
    }
  }

  _replaceWaypointToEdit() {
    this._onViewChange();
    replace(this._editComponent, this._waypointComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToWaypoint() {
    this._editComponent.reset();
    replace(this._waypointComponent, this._editComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(event) {
    const isEscKey = event.key === `Escape` || event.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToWaypoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
