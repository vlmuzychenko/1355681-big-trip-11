import AbstractSmartComponent from "./abstract-smart-component.js";
import {getSringWithoutPrefix} from "../utils/common.js";
import {SortType} from "../const.js";

const SORT_ID_PREFIX = `sort-`;

const createSortTypeTemplate = (sortType, isChecked) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType.name}">
      <input 
        id="sort-${sortType.name}" 
        class="trip-sort__input visually-hidden" 
        type="radio" 
        name="trip-sort" 
        value="sort-${sortType.name}" 
        ${isChecked ? `checked` : ``}
      />
      <label class="trip-sort__btn" for="sort-${sortType.name}">${sortType.name}</label>
    </div>`
  );
};

const createSortTemplate = (sortTypes) => {
  const sortTypesTemplate = sortTypes.map((it) => createSortTypeTemplate(it, it.checked)).join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortTypesTemplate}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractSmartComponent {
  constructor() {
    super();

    this._curentSortType = SortType.DEFAULT;
    this._setSortTypeChangeHandler = null;
  }

  getTemplate() {
    return createSortTemplate(this._getSortTypes());
  }

  getSortType() {
    return this._curentSortType;
  }

  setDefaultSortType() {
    this._curentSortType = SortType.DEFAULT;
    this.rerender();
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this._setSortTypeChangeHandler);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (event) => {
      event.preventDefault();

      if (event.target.tagName !== `INPUT`) {
        return;
      }

      const sortType = getSringWithoutPrefix(event.target.value, SORT_ID_PREFIX);

      if (this._curentSortType === sortType) {
        return;
      }

      this._curentSortType = sortType;

      this._setDayTitle();

      handler(this._curentSortType);
    });

    this._setSortTypeChangeHandler = handler;
  }

  _getSortTypes() {
    return Object.values(SortType).map((sortType) => {
      return {
        name: sortType,
        checked: sortType === this._curentSortType
      };
    });
  }

  _setDayTitle() {
    const dayElement = this.getElement().querySelector(`.trip-sort__item--day`);
    if (this._curentSortType === SortType.DEFAULT) {
      dayElement.textContent = `Day`;
    } else {
      dayElement.textContent = ``;
    }
  }
}
